import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RecommendDto {
  @ApiProperty({
    description: 'User message for the AI to recommend ONGs',
    example: 'I want to donate to NGOs that help animals',
  })
  @IsString({ message: 'The message must be a valid text' })
  @MinLength(1, { message: 'Please enter a message' })
  message: string;
}
