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
import { AudiobookService } from './audiobook.service';
import { CreateAudiobookDto } from './dto/create-audiobook.dto';
import { UpdateAudiobookDto } from './dto/update-audiobook.dto';
import { Audiobook } from './entities/audiobook.entity';
import { parseSkipLimit } from '../common/utils/common.utils';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { IS_ADMIN } from 'src/common/constants/constants';

@UseGuards(JwtAuthGuard)
@Permissions(IS_ADMIN)
@Controller('audiobook')
export class AudiobookController {
  constructor(private readonly audiobookService: AudiobookService) {}

  @Post()
  async create(
    @Body() createAudiobookDto: CreateAudiobookDto,
  ): Promise<Audiobook> {
    return this.audiobookService.create(createAudiobookDto);
  }

  @Get()
  findAll(
    @Query('skip') skip: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ): Promise<{ data: Audiobook[]; total: number }> {
    const { parsedSkip, parsedLimit } = parseSkipLimit(skip, limit);
    limit === 'all' ? Number.MAX_SAFE_INTEGER : parseInt(limit, 10) || 10;
    return this.audiobookService.findAll({
      skip: parsedSkip,
      limit: parsedLimit,
      search,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Audiobook> {
    return this.audiobookService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAudiobookDto: UpdateAudiobookDto,
  ): Promise<Audiobook> {
    return this.audiobookService.update(id, updateAudiobookDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.audiobookService.remove(id);
  }
}
