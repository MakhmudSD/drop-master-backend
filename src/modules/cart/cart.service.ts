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
					id: (item._id as any).toString(),
					productId: item.productId.toString(),
					productName: item.productName || 'Unknown Product',
					quantity: item.quantity,
					price: item.price || 0,
					image: item.image || '',
					platform: item.platform || '',
					specifications: item.specifications || '',
					createdAt: item.addedAt || new Date(),
					updatedAt: new Date(),
				})),
			},
		};
	}

	async addToCart(userId: string, addToCartDto: any) {
		const { productId, quantity, productName, price, image, platform, specifications } = addToCartDto;

		console.log('Adding to cart - userId:', userId, 'productId:', productId, 'quantity:', quantity);
		console.log('Cart service input validation - productName:', productName, 'price:', price);
		
		// Check if item already exists in cart
		let cartItem = await this.cartItemModel.findOne({ userId, productId });

		if (cartItem) {
			// Update quantity if item exists
			cartItem.quantity += quantity;
			await cartItem.save();
		} else {
			// Create new cart item with proper validation
			const cartItemData = {
				userId,
				productId,
				productName: productName || 'Sample Product',
				quantity: Number(quantity),
				price: Number(price) || 29.99,
				image: image || '/default-product.jpg',
				platform: platform || 'web',
				specifications: specifications || '',
				addedAt: new Date(),
			};
			
			console.log('Creating cart item with data:', cartItemData);
			
			try {
				cartItem = new this.cartItemModel(cartItemData);
				await cartItem.save();
				console.log('Cart item saved successfully:', cartItem._id);
			} catch (saveError) {
				console.error('MongoDB save error:', saveError);
				throw new Error(`Failed to save cart item: ${saveError.message}`);
			}
		}

		return {
			success: true,
			data: {
				item: {
					id: (cartItem._id as any).toString(),
					productId: cartItem.productId.toString(),
					productName: cartItem.productName,
					quantity: cartItem.quantity,
					price: cartItem.price,
					image: cartItem.image,
					platform: cartItem.platform,
					specifications: cartItem.specifications,
					createdAt: cartItem.addedAt || new Date(),
					updatedAt: new Date(),
				},
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
				item: {
					id: (cartItem._id as any).toString(),
					productId: cartItem.productId.toString(),
					productName: cartItem.productName,
					quantity: cartItem.quantity,
					price: cartItem.price,
					image: cartItem.image,
					platform: cartItem.platform,
					specifications: cartItem.specifications,
					createdAt: cartItem.addedAt || new Date(),
					updatedAt: new Date(),
				},
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
