import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription, BillingFrequency } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { addMonths, addYears, addWeeks } from 'date-fns';


//  we changed the startdate and nextbillingdate type to Date from string
//  change the service to handle it accordingly --------------------------------------

@Injectable()
export class SubscriptionsService {

  constructor(@InjectRepository(Subscription) private subRepo: Repository<Subscription>) {}

  private calcNextBillingDate(startDate: Date, frequency: BillingFrequency): Date {
    switch (frequency) {
      case BillingFrequency.WEEKLY: return addWeeks(startDate, 1);
      case BillingFrequency.YEARLY: return addYears(startDate, 1);
      case BillingFrequency.MONTHLY:
      default:
        return addMonths(startDate, 1);
    }
  }

  async create(userId:string, dto: CreateSubscriptionDto) {

    const startDate = new Date(dto.startDate);

    const nextbillingDate = this.calcNextBillingDate(startDate, dto.frequency);
    const subscription = this.subRepo.create({
      ...dto,
      userId,
      startDate,
      nextBillingDate: nextbillingDate,
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

  async update(id: string, userId: string, dto: UpdateSubscriptionDto) {
    const sub = await this.subRepo.findOne({ where: { id, userId }});

    if (!sub) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }

    // normalize start date
    const startDate: Date = dto.startDate
      ? new Date(dto.startDate)
      : sub.startDate;

    const frequency = dto.frequency ?? sub.frequency;

    // recalc if needed
    if (dto.startDate || dto.frequency) {
      sub.nextBillingDate = this.calcNextBillingDate(startDate, frequency);
    }

    Object.assign(sub, {
      ...dto,
      startDate,
    });

    return this.subRepo.save(sub);
  }


  async remove(id: string, userId: string) {
    const sub = await this.subRepo.findOne({ where: { id, userId }});

    if(!sub) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }

    await this.subRepo.remove(sub);

    return {
      message: 'Subscription deleted successfully',
      id,
    };
  }
}
