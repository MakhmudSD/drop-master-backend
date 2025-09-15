import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutomationController } from './automation.controller';
import { AutomationService } from './automation.service';
import { Automation, AutomationSchema } from '../../schemas/automation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Automation.name, schema: AutomationSchema }]),
  ],
  controllers: [AutomationController],
  providers: [AutomationService],
  exports: [AutomationService],
})
export class AutomationModule {}
