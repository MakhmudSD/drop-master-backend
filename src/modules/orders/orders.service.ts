import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../../shared/schemas/order.schema';
import { CreateOrderDto } from '../../shared/dto/create-order.dto';
import { UpdateOrderDto } from '../../shared/dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getOrders(
    userId: string,
    options: {
      page: number;
      limit: number;
      status?: string;
    },
  ) {
    const { page, limit, status } = options;
    const skip = (page - 1) * limit;

    const filter: { userId: string; status?: string } = { userId };
    if (status) filter.status = status;

    const orders = await this.orderModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.orderModel.countDocuments(filter);

    return {
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getOrder(id: string, userId: string) {
    const order = await this.orderModel.findOne({ _id: id, userId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      success: true,
      order,
    };
  }

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const order = new this.orderModel({
      ...createOrderDto,
      userId,
    });

    await order.save();

    return {
      success: true,
      order,
    };
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto, userId: string) {
    const order = await this.orderModel.findOne({ _id: id, userId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      { $set: updateOrderDto },
      { new: true },
    );

    return {
      success: true,
      order: updatedOrder,
    };
  }

  async deleteOrder(id: string, userId: string) {
    const order = await this.orderModel.findOne({ _id: id, userId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    await this.orderModel.findByIdAndDelete(id);

    return {
      success: true,
      message: 'Order deleted successfully',
    };
  }

  async getOrderStats(userId: string) {
    const totalOrders = await this.orderModel.countDocuments({ userId });
    const pendingOrders = await this.orderModel.countDocuments({
      userId,
      status: 'pending',
    });
    const processingOrders = await this.orderModel.countDocuments({
      userId,
      status: 'processing',
    });
    const shippedOrders = await this.orderModel.countDocuments({
      userId,
      status: 'shipped',
    });
    const deliveredOrders = await this.orderModel.countDocuments({
      userId,
      status: 'delivered',
    });

    const statusStats = await this.orderModel.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return {
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        statusStats,
      },
    };
  }
}
