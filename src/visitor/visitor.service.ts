/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Visitor, VisitorDocument } from './schemas/visitor-schema';

@Injectable()
export class VisitorService {
  constructor(
    @InjectModel(Visitor.name) private readonly visitorModel: Model<VisitorDocument>,
  ) {}

  async addVisitor(ip: string, userAgent: string) {
    const visitor = new this.visitorModel({ ip, userAgent });
    await visitor.save();
    return { success: true, message: 'Visitor recorded successfully' };
  }

  async getTotalVisitors() {
    const total = await this.visitorModel.countDocuments({ isDeleted: false });
    return { total };
  }

  async getTodayVisitors() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = await this.visitorModel.countDocuments({
      createdAt: { $gte: today },
      isDeleted: false,
    });

    return { total };
  }

  async findAll() {
    return this.visitorModel.find({ isDeleted: false }).sort({ createdAt: -1 });
  }
}
