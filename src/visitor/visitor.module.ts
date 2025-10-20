import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { Visitor, VisitorSchema } from './schemas/visitor-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Visitor.name, schema: VisitorSchema },
    ]),
  ],
  controllers: [VisitorController],
  providers: [VisitorService],
  exports: [VisitorService], // optional, jika mau digunakan di modul lain
})
export class VisitorModule {}
