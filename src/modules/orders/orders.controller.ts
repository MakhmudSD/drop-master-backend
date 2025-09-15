import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Patch,
	Delete,
	UseGuards,
	Request,
	HttpCode,
	HttpStatus,
	ParseIntPipe,
	DefaultValuePipe,
	Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from '../../libs/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
	constructor(private ordersService: OrdersService) {}

	@Get()
	async getOrders(
		@Request() req,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
		@Query('status') status?: string,
	) {
		return this.ordersService.getOrders(req.user.userId, { page, limit, status });
	}

	@Get(':id')
	async getOrder(@Param('id') id: string, @Request() req) {
		return this.ordersService.getOrder(id, req.user.userId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
		return this.ordersService.createOrder(createOrderDto, req.user.userId);
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	async updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Request() req) {
		return this.ordersService.updateOrder(id, updateOrderDto, req.user.userId);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async deleteOrder(@Param('id') id: string, @Request() req) {
		return this.ordersService.deleteOrder(id, req.user.userId);
	}

	@Get('stats/overview')
	async getOrderStats(@Request() req) {
		return this.ordersService.getOrderStats(req.user.userId);
	}
}
