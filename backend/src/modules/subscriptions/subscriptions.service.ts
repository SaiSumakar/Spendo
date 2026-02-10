import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription, BillingFrequency } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { addMonths, addYears, addWeeks, parseISO, sub } from 'date-fns';

@Injectable()
export class SubscriptionsService {

  constructor(@InjectRepository(Subscription) private subRepo: Repository<Subscription>) {}

  private calcNextBillingDate(startDate: string, frequency: BillingFrequency): Date {
    const start = parseISO(startDate);
    switch (frequency) {
      case BillingFrequency.WEEKLY: return addWeeks(start, 1);
      case BillingFrequency.YEARLY: return addYears(start, 1);
      case BillingFrequency.MONTHLY:
      default:
        return addMonths(start, 1);
    }
  }

  async create(userId:string, dto: CreateSubscriptionDto) {
    const nextbillingDate = this.calcNextBillingDate(dto.startDate, dto.frequency);
    const subscription = this.subRepo.create({
      ...dto,
      userId,
      nextBillingDate: nextbillingDate.toISOString().split('T')[0],
    })
    return this.subRepo.save(subscription);
  }

  async findAll(userId: string) {
    return this.subRepo.find({
      where: { userId },
      order: { nextBillingDate: 'ASC' }, // show upcoming billing dates first
    });
  }

  async findOne(id: string, userId: string) {
    const sub = await this.subRepo.findOne({ where: { id, userId } });
    if(!sub) throw new NotFoundException(`Subscription with id ${id} not found`); 
    return sub;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
