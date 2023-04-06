import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { QueryParams } from './dto/query.dto';
import { UpdateDto } from './dto/update.dto';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Query() query: QueryParams) {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOneOrFail(id);
  }

  @Post()
  async create(@Body() body: CreateDto) {
    return await this.userService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateDto,
  ) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.userService.deleteById(id);
  }
}
