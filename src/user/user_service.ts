import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user-schema';

@Injectable()
export class UserService {
  constructor(
    // @InjectModel('User', 'usersConnection') // 👈 harus sama persis
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findAll() {
    return this.userModel.find().exec();
  }
}
