import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { CreateGenerationDto } from './generations.dto';
import { Response } from 'express';

@Injectable()
export class GenerationsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(userId: string, dto: CreateGenerationDto) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.credits <= 0) throw new ForbiddenException('No credits remaining. Please upgrade your plan.');

    const prompt = this.buildPrompt(dto);
    const result = await this.aiService.generate(prompt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } },
    });

    const generation = await this.prisma.generation.create({
      data: { userId, type: dto.type, topic: dto.topic, tone: dto.tone, prompt, result },
    });

    return generation;
  }

  async streamCreate(userId: string, dto: CreateGenerationDto, res: Response) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.credits <= 0) throw new ForbiddenException('No credits remaining. Please upgrade your plan.');

    const prompt = this.buildPrompt(dto);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResult = '';

    await this.aiService.streamGenerate(prompt, (chunk) => {
      fullResult += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } },
    });

    const generation = await this.prisma.generation.create({
      data: { userId, type: dto.type, topic: dto.topic, tone: dto.tone, prompt, result: fullResult },
    });

    res.write(`data: ${JSON.stringify({ done: true, id: generation.id })}\n\n`);
    res.end();
  }

  async findAll(userId: string) {
    return this.prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, type: true, topic: true, tone: true, result: true, createdAt: true },
    });
  }

  async findOne(userId: string, id: string) {
    const gen = await this.prisma.generation.findUnique({ where: { id } });
    if (!gen || gen.userId !== userId) throw new NotFoundException('Generation not found');
    return gen;
  }

  async delete(userId: string, id: string) {
    const gen = await this.prisma.generation.findUnique({ where: { id } });
    if (!gen || gen.userId !== userId) throw new NotFoundException('Generation not found');
    await this.prisma.generation.delete({ where: { id } });
    return { message: 'Deleted' };
  }

  private buildPrompt(dto: CreateGenerationDto): string {
    const typeLabels: Record<string, string> = {
      post: 'a social media post',
      ideas: '5 content ideas',
      script: 'a video script',
      caption: 'a short caption',
      thread: 'a Twitter/X thread (5 tweets)',
    };

    const label = typeLabels[dto.type] ?? dto.type;

    return `You are an expert social media content creator. Write ${label} about "${dto.topic}" for ${dto.platform}.
Tone: ${dto.tone}.
Be creative, engaging, and optimized for ${dto.platform}.
${dto.type === 'ideas' ? 'Number each idea clearly.' : ''}
${dto.type === 'script' ? 'Include hook, main content, and call-to-action sections.' : ''}
${dto.type === 'thread' ? 'Format each tweet with [Tweet 1], [Tweet 2], etc.' : ''}
Respond only with the content, no extra explanation.`;
  }
}
