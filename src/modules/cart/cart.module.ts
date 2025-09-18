import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { CartItem, CartItemSchema } from '../../schemas/cart-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CartItem.name, schema: CartItemSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService, CartResolver],
  exports: [CartService],
})
export class CartModule {}
