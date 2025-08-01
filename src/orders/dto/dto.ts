// src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'John Doe', description: 'Nama lengkap pemesan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email aktif pemesan' })
  @IsEmail()
  email: string;

  // eslint-disable-next-line max-len
  @ApiProperty({ example: '+6281234567890', required: false, description: 'Nomor WhatsApp atau HP' })
  @IsOptional()
  @IsString()
  phone?: string;

  // eslint-disable-next-line max-len
  @ApiProperty({ example: 'Saya ingin membuat website e-commerce', required: false, description: 'Catatan atau permintaan tambahan' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ example: 'ecommerce', description: 'Jenis layanan yang dipesan' })
  @IsString()
  @IsNotEmpty()
  service: string;
}
