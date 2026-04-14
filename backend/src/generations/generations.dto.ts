import { IsString, IsIn, MinLength, MaxLength } from 'class-validator';

export class CreateGenerationDto {
  @IsIn(['post', 'ideas', 'script', 'caption', 'thread'])
  type: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  topic: string;

  @IsIn(['formal', 'casual', 'funny', 'motivational', 'professional'])
  tone: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  platform: string;
}
