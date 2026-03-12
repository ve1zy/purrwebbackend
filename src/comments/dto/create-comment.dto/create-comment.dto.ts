import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Looks good, but please rename variable.' })
  @IsString()
  @Length(1, 2000)
  content: string;
}
