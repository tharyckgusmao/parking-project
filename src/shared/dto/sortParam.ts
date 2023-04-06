import { IsOptional } from 'class-validator';

export class SortParam {
  @IsOptional()
  sort?: string;
}
