import { Module } from '@nestjs/common';
import { GenerationsService } from './generations.service';
import { GenerationsController } from './generations.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [GenerationsService],
  controllers: [GenerationsController],
})
export class GenerationsModule {}
