import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Body,
	Param,
	UseGuards,
	Request,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from '../../libs/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
	constructor(private cartService: CartService) {}

	@Get()
	async getCartItems(@Request() req) {
		return this.cartService.getCartItems(req.user.userId);
	}

	@Post('add')
	@HttpCode(HttpStatus.CREATED)
	async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
		return this.cartService.addToCart(req.user.userId, addToCartDto);
	}

	@Patch(':itemId')
	@HttpCode(HttpStatus.OK)
	async updateCartItem(@Request() req, @Param('itemId') itemId: string, @Body() updateCartItemDto: UpdateCartItemDto) {
		return this.cartService.updateCartItem(req.user.userId, itemId, updateCartItemDto);
	}

	@Delete(':itemId')
	@HttpCode(HttpStatus.OK)
	async removeFromCart(@Request() req, @Param('itemId') itemId: string) {
		return this.cartService.removeFromCart(req.user.userId, itemId);
	}

	@Delete('clear')
	@HttpCode(HttpStatus.OK)
	async clearCart(@Request() req) {
		return this.cartService.clearCart(req.user.userId);
	}

	@Post('checkout')
	@HttpCode(HttpStatus.OK)
	async checkout(@Request() req, @Body() checkoutData: { items: any[] }) {
		return this.cartService.checkout(req.user.userId, checkoutData?.items ?? undefined);
	}
}
