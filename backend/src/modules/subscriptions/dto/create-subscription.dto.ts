import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsEnum, 
  IsOptional, 
  IsDateString, 
  IsBoolean, 
  IsUrl 
} from 'class-validator';
import { Currency, BillingFrequency } from '../entities/subscription.entity';

export class CreateSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    price: number;

    @IsEnum(Currency)
    currency: Currency;

    @IsEnum(BillingFrequency)
    frequency: BillingFrequency;

    @IsString()
    @IsOptional()
    category?: string;

    @IsDateString()
    startDate: string;

    @IsBoolean()
    @IsOptional()
    isTrial?: boolean;

    @IsUrl()
    @IsOptional()
    websiteUrl?: string;
}
