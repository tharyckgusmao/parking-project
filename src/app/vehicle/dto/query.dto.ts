import { IntersectionType } from '@nestjs/swagger';
import { OrderParam } from 'src/shared/dto/orderParam';
import { PaginationParams } from 'src/shared/dto/paginationParams';
import { SortParam } from 'src/shared/dto/sortParam';

export class QueryParams extends IntersectionType(
  PaginationParams,
  OrderParam,
  SortParam,
) {}
