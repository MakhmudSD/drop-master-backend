import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	password: string;

	@Prop()
	profileImage?: string;

	@Prop()
	provider?: string;

	@Prop()
	googleId?: string;

	@Prop()
	kakaoId?: string;

	@Prop()
	naverId?: string;

	@Prop({ type: Object })
	preferences?: {
		language: string;
		currency: string;
	};

	@Prop({ default: 'user' })
	role: string;

	@Prop({ default: true })
	isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
