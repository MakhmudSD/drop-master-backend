import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemType, CartSummaryType, CartMutationResponse } from '../../graphql/types/cart.type';
import { AddCartItemInput, UpdateCartItemInput } from '../../graphql/inputs/cart.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => CartItemType)
@UseGuards(GqlAuthGuard)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => [CartItemType], { name: 'cartItems' })
  async getCartItems(@Context() context: any): Promise<CartItemType[]> {
    const user = context.user || context.req?.user;
    if (!user || !user.userId) {
      console.error('[CartResolver] User not authenticated');
      throw new Error('User not authenticated');
    }

    const result = await this.cartService.getCartItems(user.userId);
    return result.data.items || [];
  }

  @Query(() => CartSummaryType, { name: 'cartSummary' })
  async getCartSummary(@Context() context: any): Promise<CartSummaryType> {
    const user = context.user || context.req.user;
    if (!user || !user.userId) {
      throw new Error('User not authenticated');
    }

    const cartItems = await this.cartService.getCartItems(user.userId);
    const items = cartItems.data.items || [];
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const shippingCost = totalAmount > 50000 ? 0 : 3000; // Free shipping over 50,000 KRW
    const taxAmount = totalAmount * 0.1; // 10% tax
    const discountAmount = 0;
    const finalAmount = totalAmount + shippingCost + taxAmount - discountAmount;

    return {
      totalItems,
      totalAmount,
      shippingCost,
      taxAmount,
      discountAmount,
      finalAmount,
    };
  }

  @Mutation(() => CartMutationResponse, { name: 'addCartItem' })
  async addCartItem(
    @Context() context: any,
    @Args('input', new ValidationPipe({ transform: true })) input: AddCartItemInput,
  ): Promise<CartMutationResponse> {
    try {
      // Get user from context (set by GqlAuthGuard)
      const user = context.user || context.req.user;
      if (!user || !user.userId) {
        throw new Error('User not authenticated');
      }


      // Ensure input validation
      if (!input.productId || typeof input.productId !== 'string') {
        throw new Error('Valid productId is required');
      }
      
      if (!input.quantity || typeof input.quantity !== 'number' || input.quantity < 1) {
        throw new Error('Valid quantity (minimum 1) is required');
      }

      // Parse specifications to extract product data
      let productData: any = {};
      if (input.specifications) {
        try {
          productData = JSON.parse(input.specifications);
          console.log('Parsed product data from specifications:', productData);
        } catch (e) {
          console.warn('Failed to parse specifications:', e);
        }
      }

      const result = await this.cartService.addToCart(user.userId, {
        productId: input.productId,
        quantity: input.quantity,
        productName: productData.title || productData.name || 'Product',
        price: productData.price || 0,
        image: productData.imageUrl || '/default-product.jpg',
        platform: productData.platform || 'unknown',
        specifications: input.specifications || '',
      });

      return {
        success: result.success,
        cartItem: result.data.item,
        message: 'Item added to cart successfully',
      };
    } catch (error) {
      console.error('Cart error:', error);
      return {
        success: false,
        message: error.message || 'Failed to add item to cart',
      };
    }
  }

  @Mutation(() => CartMutationResponse, { name: 'updateCartItem' })
  async updateCartItem(
    @Context() context: any,
    @Args('input') input: UpdateCartItemInput,
  ): Promise<CartMutationResponse> {
    try {
      const user = context.req.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result = await this.cartService.updateCartItem(user.userId, input.id, {
        quantity: input.quantity,
      });

      return {
        success: result.success,
        cartItem: result.data.item,
        message: 'Item updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update item',
      };
    }
  }

  @Mutation(() => CartMutationResponse, { name: 'removeCartItem' })
  async removeCartItem(
    @Context() context: any,
    @Args('id') id: string,
  ): Promise<CartMutationResponse> {
    try {
      const user = context.req.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result = await this.cartService.removeFromCart(user.userId, id);

      return {
        success: result.success,
        message: result.data.message || 'Item removed from cart',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to remove item',
      };
    }
  }

  @Mutation(() => CartMutationResponse, { name: 'clearCart' })
  async clearCart(@Context() context: any): Promise<CartMutationResponse> {
    try {
      const user = context.req.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result = await this.cartService.clearCart(user.userId);

      return {
        success: result.success,
        message: result.data.message || 'Cart cleared successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to clear cart',
      };
    }
  }
}
