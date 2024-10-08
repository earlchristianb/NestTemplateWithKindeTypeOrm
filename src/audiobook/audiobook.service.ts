import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAudiobookDto } from './dto/create-audiobook.dto';
import { UpdateAudiobookDto } from './dto/update-audiobook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Audiobook } from './entities/audiobook.entity';
import { Author } from '../author/entities/author.entity';

@Injectable()
export class AudiobookService {
  constructor(
    @InjectRepository(Audiobook)
    private readonly audiobookRepository: Repository<Audiobook>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  async create(createAudiobookDto: CreateAudiobookDto): Promise<Audiobook> {
    const { authorIds, ...rest } = createAudiobookDto;

    const authors = await this.authorRepository.find({
      where: {
        id: In(authorIds),
      },
    });

    if (authors.length !== authorIds.length) {
      throw new Error('One or more authors do not exist');
    }

    await this.checkTitle(rest.title);

    const audiobook = this.audiobookRepository.create({
      ...rest,
      authors: authors,
    });

    return await this.audiobookRepository.save(audiobook);
  }

  async findAll({
    skip,
    limit,
    search,
  }: {
    skip: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Audiobook[]; total: number }> {
    const whereCondition = search ? [{ title: Like(`%${search}%`) }] : {};
    const [data, total] = await this.audiobookRepository.findAndCount({
      where: whereCondition,
      relations: ['authors', 'products'],

      skip: skip,
      take: limit,
    });

    return {
      data,
      total,
    };
  }

  async findOne(id: string) {
    return await this.audiobookRepository.findOne({
      where: {
        id,
      },
      relations: ['authors', 'products'],
    });
  }

  async update(
    id: string,
    updateAudiobookDto: UpdateAudiobookDto,
  ): Promise<Audiobook> {
    await this.checkTitle(updateAudiobookDto.title, id);
    const findAudiobook = await this.audiobookRepository.findOne({
      where: {
        id,
      },
      relations: ['authors'],
    });

    if (!findAudiobook) {
      throw new Error('Audiobook not found');
    }
    if (updateAudiobookDto.authorIds) {
      console.log(updateAudiobookDto.authorIds);
      const authors = await this.authorRepository.find({
        where: {
          id: In(updateAudiobookDto.authorIds),
        },
      });
      if (authors.length !== updateAudiobookDto.authorIds.length) {
        throw new Error('Invalid Author Ids');
      }
      console.log(authors);
      delete updateAudiobookDto.authorIds;
      findAudiobook.authors = authors;
    }

    Object.assign(findAudiobook, updateAudiobookDto);

    return await this.audiobookRepository.save(findAudiobook);
  }

  async remove(id: string): Promise<void> {
    const audiobook = await this.audiobookRepository.softDelete(id);
    if (!audiobook) {
      throw new Error('Audiobook not found');
    }
  }

  private async checkTitle(title: string, id?: string): Promise<void> {
    const findTitle = await this.audiobookRepository.findOne({
      where: { title },
    });
    if (id && findTitle && findTitle.id === id) {
      return;
    }
    if (findTitle) {
      throw new BadRequestException('Title already exists');
    }
  }
}
