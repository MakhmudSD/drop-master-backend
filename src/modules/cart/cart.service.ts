import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartItem, CartItemDocument } from '../../schemas/cart-item.schema';
import { AddToCartDto, UpdateCartItemDto } from '../../libs/dto';

@Injectable()
export class CartService {
	constructor(@InjectModel(CartItem.name) private cartItemModel: Model<CartItemDocument>) {}

	async getCartItems(userId: string) {
		try {
			const items = await this.cartItemModel.find({ userId }).exec();
			
		const mappedItems = items.map((item) => ({
			id: (item._id as any).toString(),
			productId: item.productId || 'unknown',
			productName: item.productName || 'Unknown Product',
			quantity: item.quantity,
			price: item.price || 0,
			image: item.image || '',
			platform: item.platform || '',
			specifications: item.specifications || '',
			createdAt: item.addedAt || new Date(),
			updatedAt: new Date(),
		}));

			return {
				success: true,
				data: {
					items: mappedItems,
				},
			};
		} catch (error) {
			console.error('[CartService] ❌ Error fetching cart items:', error);
			return {
				success: false,
				data: {
					items: [],
				},
			};
		}
	}

	async addToCart(userId: string, addToCartDto: any) {
		const { productId, quantity, productName, price, image, platform, specifications } = addToCartDto;

		// Check if item already exists in cart
		let cartItem = await this.cartItemModel.findOne({ userId, productId });

		if (cartItem) {
			// Update quantity if item exists
			cartItem.quantity += quantity;
			await cartItem.save();
		} else {
			// Create new cart item
			const cartItemData = {
				userId,
				productId,
				productName: productName || 'Product',
				quantity: Number(quantity),
				price: Number(price) || 0,
				image: image || '/default-product.jpg',
				platform: platform || 'unknown',
				specifications: specifications || '',
				addedAt: new Date(),
			};
			
			console.log('[CartService] Creating new cart item:', cartItemData);
			
			try {
				cartItem = new this.cartItemModel(cartItemData);
				await cartItem.save();
				console.log('[CartService] ✅ Cart item saved successfully! ID:', cartItem._id);
			} catch (saveError) {
				console.error('[CartService] ❌ MongoDB save error:', saveError);
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
