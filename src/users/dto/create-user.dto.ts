import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ssword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  displayName?: string;
}