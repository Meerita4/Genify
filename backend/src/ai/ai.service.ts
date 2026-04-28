import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private client: Groq;

  constructor(private config: ConfigService) {
    this.client = new Groq({ apiKey: this.config.get<string>('GROQ_API_KEY') });
  }

  async generate(prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.8,
      });
      return response.choices[0]?.message?.content ?? '';
    } catch {
      throw new InternalServerErrorException('AI generation failed');
    }
  }

  async streamGenerate(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
    try {
      const stream = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.8,
        stream: true,
      });

      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) onChunk(text);
      }
    } catch {
      throw new InternalServerErrorException('AI streaming failed');
    }
  }
}
