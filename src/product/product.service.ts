import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Audiobook } from '../audiobook/entities/audiobook.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Audiobook)
    private readonly audiobookRepository: Repository<Audiobook>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const audioBooks = await this.audiobookRepository.find({
      where: {
        id: In(createProductDto.itemIds),
      },
    });
    if (audioBooks.length !== createProductDto.itemIds.length) {
      throw new Error('Invalid Item Ids');
    }
    delete createProductDto.itemIds;

    const product = this.productRepository.create({
      ...createProductDto,
      items: audioBooks,
    });
    return this.productRepository.save(product);
  }

  async findAll({
    skip,
    limit,
    search,
  }: {
    skip: number;
    limit: number;
    search?: string;
  }): Promise<{ data: Product[]; total: number }> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.items', 'audiobook');

    if (search) {
      queryBuilder.andWhere(
        '(product.title LIKE :search OR audiobook.title LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Update the items relation
    for (const product of data) {
      product.items = await this.audiobookRepository.find({
        where: { id: In(product.items.map((item) => item.id)) },
      });
    }
    return {
      data,
      total,
    };
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: ['items'],
    });
    if (!product) {
      throw new Error('Product not found');
    }
    if (updateProductDto.itemIds) {
      const audioBooks = await this.audiobookRepository.find({
        where: {
          id: In(updateProductDto.itemIds),
        },
      });
      if (audioBooks.length !== updateProductDto.itemIds.length) {
        throw new Error('Invalid Item Ids');
      }
      delete updateProductDto.itemIds;
      product.items = audioBooks;
    }
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const res = await this.productRepository.softDelete(id);
    if (res.affected === 0) {
      throw new Error('Product not found');
    }
  }
}
