// src/modules/categories/dto/create-category.dto.ts
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaObjectDto } from '../..//media/dto/create-media.dto';
import { Type } from 'class-transformer';

export class CreateAirdropDto {
  @ApiProperty({ example: '1WIN' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'airdrop legit' })
  @IsString()
  @IsOptional()
  description?: string;
  
  @ApiProperty({ example: 'airdrop bagus' })
  @IsString()
  @IsOptional()
  sub_description?: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  link_ref?: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  link_airdrop?: string;
  
  @ApiProperty({ type: MediaObjectDto, required: false })
  @IsOptional()
  @Type(() => MediaObjectDto)
  icon?: MediaObjectDto;

  @ApiProperty({ type: [MediaObjectDto], required: false })
  @IsOptional()
  @IsArray()
  @Type(() => MediaObjectDto)
  images?: MediaObjectDto[];

  @IsNumber()
  @IsOptional()
  date_release?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}