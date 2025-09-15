import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AutomationDocument = Automation & Document;

@Schema({ timestamps: true })
export class Automation {
	@Prop({ required: true, ref: 'User' })
	userId: string;

	@Prop({ default: false })
	autoSourcing: boolean;

	@Prop({ default: false })
	autoUpload: boolean;

	@Prop({ default: 60 })
	marginRate: number;

	@Prop({ type: [String], default: ['coupang'] })
	targetPlatforms: string[];

	@Prop({ type: [String], default: ['aliexpress'] })
	sourcePlatforms: string[];

	@Prop({ type: [String] })
	selectedCategories: string[];

	@Prop({ default: 30 })
	maxProductsPerDay: number;

	@Prop({ default: 40 })
	minMarginRate: number;

	@Prop({ default: 200 })
	minSalesCount: number;

	@Prop({ default: false })
	isActive: boolean;

	@Prop()
	lastRunAt?: Date;

	@Prop()
	nextRunAt?: Date;
}

export const AutomationSchema = SchemaFactory.createForClass(Automation);
