import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

// App core
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AutomationModule } from './modules/automation/automation.module';
import { CartModule } from './modules/cart/cart.module';
import { ScrapingModule } from './modules/scraping/scraping.module';

// Schemas
import { User, UserSchema } from './shared/schemas/user.schema';
import { Product, ProductSchema } from './shared/schemas/product.schema';
import { Order, OrderSchema } from './shared/schemas/order.schema';
import { Automation, AutomationSchema } from './shared/schemas/automation.schema';
import { ScrapingRun, ScrapingRunSchema } from './shared/schemas/scraping-run.schema';
import { CartItem, CartItemSchema } from './shared/schemas/cart-item.schema';

// Configuration
import { UsersModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    PassportModule,
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/default-db'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Automation.name, schema: AutomationSchema },
      { name: ScrapingRun.name, schema: ScrapingRunSchema },
      { name: CartItem.name, schema: CartItemSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
    
    // Feature modules
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    AutomationModule,
    CartModule,
    ScrapingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}