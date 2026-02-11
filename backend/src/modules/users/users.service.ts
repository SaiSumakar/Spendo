import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { json2csv } from 'json-2-csv';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name} = createUserDto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    // check if user exists
    const existingUser = await this.userRepo.findOne({where: { email }});
    if(existingUser) {
      throw new ConflictException('Email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      name,
    });

    return this.userRepo.save(user);
  }

  async findAll() {
    const users = await this.userRepo.find();

    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  async getProfile(id: string) {
    const userFound = await this.userRepo.findOne({where: { id }})

    if (!userFound) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return userFound;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', {email})
      .getOne()
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No fields provided for update');
    }

    const user = await this.userRepo.preload({
      id,
      ...updateUserDto
    })

    if(!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }

    if(updateUserDto.password) {
      // user.password = bcrypt.hash(updateUserDto.password, 10)
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const savedUser = await this.userRepo.save(user);
    return savedUser;
  }

  async remove(id: string) {
    const res = await this.userRepo.delete(id)

    if(res.affected === 0){
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return {
      message: "User deleted successfully",
    };
  }

  async exportData(id: string) {
    const user = await this.userRepo.findOne({
      where: { id: id },
      relations: ['subscriptions']
    });

    if(!user) throw new NotFoundException('User not found');

    const fields = ['Name', 'Price', 'Currency', 'Frequency', 'Next Billing', 'Category'];
    const data = user.subscriptions.map((sub) => ({
      Name: sub.name,
      Price: Number(sub.price),
      Currency: sub.currency,
      Frequency: sub.frequency,
      'Next Billing': sub.nextBillingDate,
      Category: sub.category
    }));

    const csv = await json2csv(data, {
      expandArrayObjects: false,
      expandNestedObjects: false,
    });
    return csv;
  }
}
