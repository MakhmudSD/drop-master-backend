export interface T {
	[key: string]: any;
}

// SHAPING
import { ObjectId } from 'mongodb';

export const shapeIntoMongoObjectId = (target: string | ObjectId): ObjectId => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};

