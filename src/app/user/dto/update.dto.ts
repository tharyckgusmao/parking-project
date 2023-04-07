import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import ApiSchema from 'src/shared/decorator/ApiSchemaDecorator';

@ApiSchema({ name: 'UserUpdateDto' })
export class UpdateDto {
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  company_id: string;

  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{8,}$/, {
    message: 'min 1 lowercase, min 1 case, min 1 @#$, min 1 0123',
  })
  @MinLength(8, { message: 'Password must contain at least 8 characters' })
  @MaxLength(12, {
    message: 'The password must contain a maximum of 12 characters',
  })
  @ApiProperty()
  password: string;
}
