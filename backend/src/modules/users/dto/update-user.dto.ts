import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { 
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsIn,
  IsBoolean,
  IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    // preferences
    @IsOptional()
    @IsString()
    currency?: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    theme?: string;

    // budget
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    monthlyLimit?: number;

    // notifications
    @IsOptional()
    @IsBoolean()
    emailAlerts?: boolean;

    @IsOptional()
    @IsBoolean()
    pushAlerts?: boolean;

    @IsOptional()
    @IsInt()
    daysBeforeBill?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(28)
    budgetResetDay?: number;

    @IsOptional()
    @IsIn(['monthly', 'weekly'])
    budgetCycle?: 'monthly' | 'weekly';
}
