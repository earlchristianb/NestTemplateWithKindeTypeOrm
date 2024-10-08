import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ProductCurrency } from '../enum/product.enum';
import { ConditionalRequired } from '../../common/decorators/conditional-required.decorator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsUUID('all', { each: true })
  itemIds: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(ProductCurrency)
  @IsOptional()
  currency: string;

  @IsBoolean()
  @IsNotEmpty()
  limitedTimeOffer: boolean;

  @ConditionalRequired('limitedTimeOffer', true)
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ConditionalRequired('limitedTimeOffer', true)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
