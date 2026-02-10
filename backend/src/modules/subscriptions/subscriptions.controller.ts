import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
@Controller('subscriptions')
@UseGuards(JwtAuthGuard) // we need to protect all routes in this controller
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.subscriptionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.subscriptionsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser('userId') userId: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(id, userId, updateSubscriptionDto);
  }

  @Delete(':id')
  remove(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.subscriptionsService.remove(id, userId);
  }
}
