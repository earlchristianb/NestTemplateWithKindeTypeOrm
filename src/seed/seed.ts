import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthorService } from '../author/author.service';
import { AudiobookService } from '../audiobook/audiobook.service';
import { ProductService } from '../product/product.service';
import { CreateAuthorDto } from '../author/dto/create-author.dto';
import { CreateAudiobookDto } from '../audiobook/dto/create-audiobook.dto';
import { CreateProductDto } from '../product/dto/create-product.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authorService = app.get(AuthorService);
  const audiobookService = app.get(AudiobookService);
  const productService = app.get(ProductService);

  // Create an author
  const createAuthorDto: CreateAuthorDto = {
    name: 'Marco Jose',
    description: 'A sample author description',
    picture:
      'https://res.cloudinary.com/earldev/image/upload/c_thumb,w_200,g_face/v1728147620/proto/xxp8ehrjh69gpgbvwtac.jpg',
  };
  const author = await authorService.create(createAuthorDto);

  // Create an audiobook
  const createAudiobookDto: CreateAudiobookDto = {
    title: 'Tell Me Where It Hurts',
    description:
      'Mayaman si Aivan. Mahirap si Ara. Magkaibang mundo. Langit at Lupa. Ang pagkakaibang ito ay pilit at paulit-ulit silang paghihiwalayin. Pero hindi hahayaan ni Aivan na mawala si Ara sa buhay niya kahit ilang beses pa sila saktan ng tadhana',
    picture:
      'https://res.cloudinary.com/earldev/image/upload/v1728147909/proto/pva1atnjctgedt4c0px6.png',
    authorIds: [author?.id],
  };
  const audiobook = await audiobookService.create(createAudiobookDto);

  // Create a product
  const createProductDto: CreateProductDto = {
    title: 'TMWIH Premium Episodes',
    description: 'A sample product description',
    price: 90,
    currency: 'PHP',
    limitedTimeOffer: false,
    isActive: true,
    itemIds: [audiobook.id],
  };
  await productService.create(createProductDto);

  await app.close();
}

bootstrap();
