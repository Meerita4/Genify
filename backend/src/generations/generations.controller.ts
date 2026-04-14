import {
  Controller, Post, Get, Delete, Body, Param, UseGuards, Request, Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { GenerationsService } from './generations.service';
import { CreateGenerationDto } from './generations.dto';

@Controller('generations')
@UseGuards(AuthGuard('jwt'))
export class GenerationsController {
  constructor(private generationsService: GenerationsService) {}

  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateGenerationDto,
  ) {
    return this.generationsService.create(req.user.id, dto);
  }

  @Post('stream')
  async stream(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateGenerationDto,
    @Res() res: Response,
  ) {
    return this.generationsService.streamCreate(req.user.id, dto, res);
  }

  @Get()
  findAll(@Request() req: { user: { id: string } }) {
    return this.generationsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.generationsService.findOne(req.user.id, id);
  }

  @Delete(':id')
  delete(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.generationsService.delete(req.user.id, id);
  }
}
