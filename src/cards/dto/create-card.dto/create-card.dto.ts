import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ example: 'Implement auth' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiPropertyOptional({ example: 'Need to add JWT + swagger' })
  @IsOptional()
  @IsString()
  @Length(0, 5000)
  description?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
