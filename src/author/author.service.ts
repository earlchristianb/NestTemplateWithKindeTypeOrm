import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    await this.checkName(createAuthorDto.name);
    const author = this.authorRepository.create(createAuthorDto);
    return this.authorRepository.save(author);
  }

  async findAll({
    skip,
    limit,
    search,
  }: {
    skip: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Author[]; total: number }> {
    const whereCondition = search ? [{ name: Like(`%${search}%`) }] : {};
    const [data, total] = await this.authorRepository.findAndCount({
      where: whereCondition,
      skip: skip,
      take: limit,
      relations: ['audiobooks'],
    });
    return {
      data,
      total,
    };
  }

  async findOne(id: string): Promise<Author> {
    return await this.authorRepository.findOne({
      where: { id },
      relations: ['audiobooks'],
    });
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    await this.checkName(updateAuthorDto.name, id);
    const author = await this.authorRepository.findOne({
      where: { id },
    });
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    Object.assign(author, updateAuthorDto);
    return await this.authorRepository.save(author);
  }

  async remove(id: string): Promise<void> {
    const res = await this.authorRepository.softDelete(id);
    if (res.affected === 0) {
      throw new NotFoundException('Author not found');
    }
  }

  private async checkName(name: string, id?: string): Promise<void> {
    const author = await this.authorRepository.findOne({ where: { name } });
    if (id && author && author.id === id) {
      return;
    }
    if (author) {
      throw new Error('Author already exists');
    }
  }
}
