import {
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateDto {
  @IsNotEmpty()
  @IsOptional()
  company_id: string;

  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
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
  password: string;
}