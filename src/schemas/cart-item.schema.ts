import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartItemDocument = CartItem & Document;

@Schema({ timestamps: true })
export class CartItem {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ default: 'Sample Product' })
  productName: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ default: 29.99, min: 0 })
  price: number;

  @Prop({ default: '/default-product.jpg' })
  image: string;

  @Prop({ default: 'web' })
  platform: string;

  @Prop({ default: '' })
  specifications: string;

  @Prop({ default: Date.now })
  addedAt: Date;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
