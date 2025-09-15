import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem, CartItemDocument } from '../../schemas/cart-item.schema';
import { AddToCartDto, UpdateCartItemDto } from '../../libs/dto';

@Injectable()
export class CartService {
	constructor(@InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>) {}

	async getCartItems(userId: string) {
		const items = await this.cartItemModel.find({ userId }).populate('productId');

		return {
			success: true,
			data: {
				items: items.map((item) => ({
					id: item._id,
					productId: item.productId,
					quantity: item.quantity,
					addedAt: item.addedAt,
				})),
			},
		};
	}

	async addToCart(userId: string, addToCartDto: AddToCartDto) {
		const { productId, quantity } = addToCartDto;

		// Check if item already exists in cart
		let cartItem = await this.cartItemModel.findOne({ userId, productId });

		if (cartItem) {
			// Update quantity if item exists
			cartItem.quantity += quantity;
			await cartItem.save();
		} else {
			// Create new cart item
			cartItem = new this.cartItemModel({
				userId,
				productId,
				quantity,
				addedAt: new Date(),
			});
			await cartItem.save();
		}

		return {
			success: true,
			data: {
				item: cartItem,
			},
		};
	}

	async updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
		const { quantity } = updateCartItemDto;

		const cartItem = await this.cartItemModel.findOne({ _id: itemId, userId });
		if (!cartItem) {
			throw new NotFoundException('Cart item not found');
		}

		cartItem.quantity = quantity;
		await cartItem.save();

		return {
			success: true,
			data: {
				item: cartItem,
			},
		};
	}

	async removeFromCart(userId: string, itemId: string) {
		const cartItem = await this.cartItemModel.findOne({ _id: itemId, userId });
		if (!cartItem) {
			throw new NotFoundException('Cart item not found');
		}

		await this.cartItemModel.findByIdAndDelete(itemId);

		return {
			success: true,
			data: {
				message: 'Item removed from cart',
			},
		};
	}

	async clearCart(userId: string) {
		await this.cartItemModel.deleteMany({ userId });

		return {
			success: true,
			data: {
				message: 'Cart cleared',
			},
		};
	}

	async checkout(userId: string, items?: any) {
		// In a real implementation, this would:
		// 1. Create an order
		// 2. Process payment
		// 3. Clear the cart
		// 4. Send confirmation email

		// For now, just clear the cart
		await this.cartItemModel.deleteMany({ userId });

		return {
			success: true,
			data: {
				orderId: `order_${Date.now()}`,
				message: 'Order placed successfully',
			},
		};
	}
}
