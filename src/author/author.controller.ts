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
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { parseSkipLimit } from '../common/utils/common.utils';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { IS_ADMIN } from '../common/constants/constants';
import { Permissions } from '../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Permissions(IS_ADMIN)
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Permissions(IS_ADMIN)
  @Get()
  findAll(
    @Query('skip') skip: string,
    @Query('limit') limit: string,
    @Query('search') search: string,
  ) {
    const { parsedSkip, parsedLimit } = parseSkipLimit(skip, limit);
    return this.authorService.findAll({
      skip: parsedSkip,
      limit: parsedLimit,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.authorService.remove(id);
  }
}
