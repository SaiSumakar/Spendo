import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { User } from '../users/entities/user.entity';
import { startOfMonth, endOfMonth, format, subDays, isWithinInterval, addDays } from 'date-fns';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Subscription) private subRepo: Repository<Subscription>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) {}

    private getMonthlyCost(sub: Subscription) {
        const price = Number(sub.price);

        switch (sub.frequency) {
            case 'YEARLY': return price / 12;
            case 'WEEKLY': return price * 4.33;
            default: return price;
        }
    }

    async getStatistics(userId: string) {
        const today = new Date();
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);

        // user and subscriptions
        const user = await this.userRepo.findOne({ where: { id: userId } });
        const subs = await this.subRepo.find({ where: { userId } });

        // kpi calculation
        const activeSubsCount = subs.length;
        const trialsCount = subs.filter(sub => sub.isTrial).length;
        const monthlyBurn = subs.reduce((sum, sub) => sum + this.getMonthlyCost(sub), 0);
        const safeToSpend = Number(user?.monthlyLimit) - monthlyBurn;
        const userCurrency = user?.currency
        const monthlyLimit = Number(user?.monthlyLimit)

        const categoryTotals = {};
        subs.forEach(sub => {
            const cat = sub.category || 'General';
            categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(sub.price);
        });
            
        const categoryData = Object.keys(categoryTotals).map((name, index) => ({
            name,
            value: categoryTotals[name],
            color: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'][index % 5],
        }));

        const next14Days = Array.from({ length: 14 }, (_, i) => addDays(today, i));
        // Bills remaining in this month
        const upcomingBills = subs
        .filter(sub => {
            if (!sub.nextBillingDate) return false;
            const billDate = new Date(sub.nextBillingDate);
            return isWithinInterval(billDate, { start: today, end: monthEnd });
        })
        .map(sub => ({
            id: sub.id,
            name: sub.name,
            amount: Number(sub.price),
            date: sub.nextBillingDate,
            category: sub.category,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


        const velocityData = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(today, 6 - i);
            return {
                day: format(date, 'EEE'),
                spend: Math.floor(Math.random() * 20), // We'll replace this once we have a Transactions module
                cumulative: Math.floor((monthlyBurn / 30) * (i + 1)), // Simulated linear burn
            };
        });


        return {
            kpiStats: {
                runRate: monthlyBurn,
                activeSubs: activeSubsCount,
                trialWatch: trialsCount,
                safeToSpend: safeToSpend > 0 ? safeToSpend : 0,
                monthlyLimit: monthlyLimit
            },
            categoryData,
            velocityData,
            upcomingBills,
            userCurrency
        }
    }
}
