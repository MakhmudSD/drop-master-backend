import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ProductType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field()
  imageUrl: string;

  @Field()
  link: string;

  @Field()
  platform: string;

  @Field(() => Int, { nullable: true })
  salesCount?: number;

  @Field(() => Float, { nullable: true })
  growthRate?: number;

  @Field(() => Float, { nullable: true })
  estimatedMargin?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  brand?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  availability?: string;

  @Field(() => Float, { nullable: true })
  rating?: number;

  @Field(() => Int, { nullable: true })
  reviewCount?: number;

  @Field({ nullable: true })
  shippingInfo?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  specifications?: string;

  @Field({ nullable: true })
  originalPrice?: string;

  @Field(() => Float, { nullable: true })
  discount?: number;

  @Field(() => Int, { nullable: true })
  stock?: number;

  @Field({ nullable: true })
  seller?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  competitionLevel?: string;

  @Field(() => Float, { nullable: true })
  alibabaPrice?: number;
}
