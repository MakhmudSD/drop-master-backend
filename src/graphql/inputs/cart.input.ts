import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsNumber, Min, IsOptional } from 'class-validator';

@InputType()
export class AddCartItemInput {
  @Field(() => ID)
  @IsString()
  productId: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  specifications?: string;
}

@InputType()
export class UpdateCartItemInput {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  quantity: number;
}
