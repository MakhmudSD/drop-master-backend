import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  descriptionKorean: string;

  @Prop({ required: true })
  priceKRW: number;

  @Prop({ required: true })
  sourcePrice: number;

  @Prop({ required: true })
  marginRate: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  targetPlatform: string;

  @Prop({ required: true })
  sourcePlatform: string;

  @Prop({ required: true })
  sourceUrl: string;

  @Prop({ type: [String] })
  imageUrls: string[];

  @Prop({ default: 'draft' })
  status: string;

  @Prop()
  salesCount?: number;

  @Prop()
  growthRate?: number;

  @Prop()
  competitionLevel?: string;

  @Prop()
  lastScrapedAt?: Date;

  @Prop({ type: Object })
  metadata?: any;

  // New fields for enhanced scraping system
  @Prop({ 
    required: true, 
    enum: ['coupang', 'aliexpress', 'naver', '11bunker', 'alibaba'] 
  })
  source: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, default: 'In Stock' })
  stock: string;

  @Prop({ required: true, default: Date.now })
  lastUpdated: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

