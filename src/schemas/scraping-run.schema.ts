import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScrapingRunDocument = ScrapingRun & Document;

@Schema({ timestamps: true })
export class ScrapingRun {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  platform: string;

  @Prop({ required: true })
  runId: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  keywords?: string[];

  @Prop()
  categories?: string[];

  @Prop({ default: 20 })
  maxResults: number;

  @Prop({ type: Object })
  results?: any[];

  @Prop()
  errorMessage?: string;

  @Prop()
  completedAt?: Date;

  @Prop({ type: Object })
  metadata?: any;
}

export const ScrapingRunSchema = SchemaFactory.createForClass(ScrapingRun);

