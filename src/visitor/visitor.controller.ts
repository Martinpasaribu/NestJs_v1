/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VisitorService } from './visitor.service';
import { Visitor } from './schemas/visitor-schema';
import { Request } from 'express';

@ApiTags('Visitor')
@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post('/add')
  @ApiOperation({ summary: 'Record a new visitor' })
  async addVisitor(@Req() req: Request, @Body() body: Partial<Visitor>) {
    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    return this.visitorService.addVisitor(ip, userAgent);
  }

  @Get()
  @ApiOperation({ summary: 'Get total visitor count' })
  async findAll() {
    return this.visitorService.getTotalVisitors();
  }

  @Get('/today')
  @ApiOperation({ summary: 'Get today’s visitor count' })
  async findToday() {
    return this.visitorService.getTodayVisitors();
  }
}
