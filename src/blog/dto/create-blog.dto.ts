import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  desc: string;

  @ApiProperty()
  sub_desc: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: [Object], required: false })
  comment?: any[];

  @ApiProperty({ default: 0 })
  view?: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  image_bg: string;

  @ApiProperty({ type: [String] })
  images: string[];

  @ApiProperty()
  category: string;

  @ApiProperty({ type: [String] })
  tags: string[];

@ApiProperty({ type: String, description: 'ID dari author' })
author: string; // <- ini boleh string karena user input ID (bukan nama)

}
