import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Header } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import express from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // use this protect any routes from unauthorized access, only logged in users can access specific routes 
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser('userId') userId: string){
    return this.usersService.getProfile(userId);
  }

  // @Get(':id')
  // @UseGuards(JwtAuthGuard)
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(id);
  // }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  update(@CurrentUser('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser('userId') userId: string,) {
    return this.usersService.remove(userId);
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="finances.csv"')
  async exportData(@CurrentUser('userId') userId: string, @Res() res: express.Response) {
    const csv = await this.usersService.exportData(userId);
    res.send(csv);
  }
}
