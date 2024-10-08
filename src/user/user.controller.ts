import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { IS_ADMIN } from '../common/constants/constants';
import { GetUser } from '../common/decorators/get-user.param.decorator';
import { RequestUser } from '../common/types/request-user.type';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { parseSkipLimit } from '../common/utils/common.utils';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Permissions(IS_ADMIN)
  @Get()
  findAll(
    @Query('limit') limit: string,
    @Query('skip') skip: string,
    @Query('search') search: string,
  ) {
    const { parsedLimit, parsedSkip } = parseSkipLimit(skip, limit);
    return this.userService.findAll({
      limit: parsedLimit,
      skip: parsedSkip,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @Patch(':id')
  update(
    @GetUser() user: RequestUser,
    @Body() data: UpdateUserDto,
    @Param('id') id: string,
  ) {
    if (user.sub === id) {
      return this.userService.update(id, data);
    }
    if (!user.permissions.includes(IS_ADMIN)) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return this.userService.update(id, data);
  }

  @Permissions(IS_ADMIN)
  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.userService.removeOne(id);
  }
}
