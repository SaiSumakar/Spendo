import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { IsNotEmpty, Min, ValidateIf, IsString } from 'class-validator';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
    @ValidateIf(o => o.name !== undefined)
    @IsString()
    @IsNotEmpty()
    name?: string;
}
