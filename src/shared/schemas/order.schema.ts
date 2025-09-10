import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true, ref: 'Product' })
  productId: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop({ required: true })
  shippingAddress: string;

  @Prop({ required: true })
  sourcePlatform: string;

  @Prop({ required: true })
  targetPlatform: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  notes?: string;

  @Prop()
  trackingNumber?: string;

  @Prop()
  shippedAt?: Date;

  @Prop()
  deliveredAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

