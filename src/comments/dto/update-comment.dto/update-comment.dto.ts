import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({ example: 'Looks good, but please rename variable.' })
  @IsOptional()
  @IsString()
  @Length(1, 2000)
  content?: string;
}
