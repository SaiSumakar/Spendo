import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {

  constructor(@InjectRepository(Transaction) private transactionRepo: Repository<Transaction>) {}

  async create(userId: string, dto: CreateTransactionDto) {
    const transaction = this.transactionRepo.create({
      ...dto,
      userId
    })
    return this.transactionRepo.save(transaction);
  }

  async findAll(userId: string) {
    return this.transactionRepo.find({
      where: { userId },
      order: { date: 'DESC' }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async findBySubscription(userId: string, subscriptionId: string) {
    return this.transactionRepo.find({
      where: { userId, subscriptionId },
      order: { date: 'DESC' }
    })
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(userId: string, id: string) {
    const transaction = await this.transactionRepo.findOne({ where: { id, userId } });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return this.transactionRepo.remove(transaction);
  }
}
