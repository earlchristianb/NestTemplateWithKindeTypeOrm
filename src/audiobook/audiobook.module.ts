import { Module } from '@nestjs/common';
import { AudiobookService } from './audiobook.service';
import { AudiobookController } from './audiobook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audiobook } from './entities/audiobook.entity';
import { Author } from '../author/entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Audiobook, Author])],
  controllers: [AudiobookController],
  providers: [AudiobookService],
})
export class AudiobookModule {}
