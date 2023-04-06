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
import { CompanyService } from './company.service';
import { CreateDto } from './dto/create.dto';
import { QueryParams } from './dto/query.dto';

@Controller('/api/v1/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAll(@Query() query: QueryParams) {
    return await this.companyService.findAll(query);
  }

  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string) {
    return await this.companyService.findOneOrFail(id);
  }

  @Post()
  async create(@Body() body: CreateDto) {
    return await this.companyService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateDto,
  ) {
    return await this.companyService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.companyService.deleteById(id);
  }
}
