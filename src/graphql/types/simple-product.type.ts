import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SimpleProduct {
  @Field()
  title: string;

  @Field()
  link: string;
}
