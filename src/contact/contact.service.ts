import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/dto';

@Injectable()
export class ContactService {
  constructor(@InjectModel(Contact.name) private orderModel: Model<ContactDocument>) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = new this.orderModel(createContactDto);
    return contact.save();
  }

  async findAll(): Promise<Contact[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }
}
