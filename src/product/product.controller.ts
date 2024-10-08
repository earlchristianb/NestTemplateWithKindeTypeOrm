import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { parseSkipLimit } from '../common/utils/common.utils';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { IS_ADMIN } from '../common/constants/constants';

@UseGuards(JwtAuthGuard)
@Permissions(IS_ADMIN)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    console.log(createProductDto);
    return this.productService.create({
      ...createProductDto,
      price: Number(createProductDto.price),
    });
  }

  @Get()
  findAll(
    @Query('skip') skip: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ) {
    const { parsedSkip, parsedLimit } = parseSkipLimit(skip, limit);
    return this.productService.findAll({
      skip: parsedSkip,
      limit: parsedLimit,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateProductDto) {
    return this.productService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
