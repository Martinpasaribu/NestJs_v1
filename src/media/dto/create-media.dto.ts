import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class MediaObjectDto {
  @ApiProperty({ 
    example: 'https://ik.imagekit.io/yourid/image.jpg',
    description: 'URL file dari ImageKit' 
  })
  @IsString()
  @IsNotEmpty() // Wajib, karena di Schema required: true
  url: string;

  @ApiProperty({ 
    example: 'file_id_123',
    description: 'ID file dari ImageKit' 
  })
  @IsString()
  @IsNotEmpty() // Wajib, karena di Schema required: true
  fileId: string;

  @ApiProperty({ 
    example: 'image', 
    default: 'image',
    required: false 
  })
  @IsString()
  @IsOptional() // Opsional di DTO, karena di Schema ada default: 'image'
  fileType?: string;
}