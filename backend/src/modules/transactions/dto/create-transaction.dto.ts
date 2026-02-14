import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID, IsDate, IsEnum, MaxLength } from 'class-validator';
import { ExpenseType } from '../entities/transaction.entity';

export class CreateTransactionDto {

  @IsNotEmpty()
  @IsNumber()
  amount: number; 

  @IsEnum(ExpenseType)
  type: ExpenseType;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsString()
  subscriptionId?: string;
}