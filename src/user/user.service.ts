import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: data.email },
        {
          id: data.id,
        },
      ],
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findAll({
    skip,
    limit,
    search,
  }: {
    skip: number;
    limit: number;
    search?: string;
  }) {
    const whereCondition = search
      ? [{ email: Like(`%${search}%`) }, { name: Like(`%${search}%`) }]
      : {};
    const [data, total] = await this.userRepository.findAndCount({
      where: whereCondition,
      skip: skip,
      take: limit,
    });
    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('User Id is required');
    }
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  async removeOne(id: string) {
    const user = await this.userRepository.softDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
