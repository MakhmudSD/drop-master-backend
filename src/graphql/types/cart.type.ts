import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class CartItemType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  productId: string;

  @Field()
  productName: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  platform?: string;

  @Field({ nullable: true })
  specifications?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CartSummaryType {
  @Field(() => Int)
  totalItems: number;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => Float)
  shippingCost: number;

  @Field(() => Float)
  taxAmount: number;

  @Field(() => Float)
  discountAmount: number;

  @Field(() => Float)
  finalAmount: number;
}

@ObjectType()
export class CartMutationResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  cartItem?: CartItemType;

  @Field({ nullable: true })
  message?: string;
}
