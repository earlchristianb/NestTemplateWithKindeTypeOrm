import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audiobook } from '../audiobook/entities/audiobook.entity';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Audiobook])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
