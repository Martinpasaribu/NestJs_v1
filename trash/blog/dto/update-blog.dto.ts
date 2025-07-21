import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-blog.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {}
