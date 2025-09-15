import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Automation, AutomationDocument } from '../../schemas/automation.schema';
import { UpdateAutomationDto } from '../../libs/dto';
@Injectable()
export class AutomationService {
	constructor(@InjectModel(Automation.name) private automationModel: Model<AutomationDocument>) {}

	async getAutomationSettings(userId: string) {
		let automation = await this.automationModel.findOne({ userId });

		if (!automation) {
			// Create default automation settings
			automation = new this.automationModel({
				userId,
				autoSourcing: false,
				autoUpload: false,
				marginRate: 60,
				targetPlatforms: ['coupang'],
				sourcePlatforms: ['aliexpress'],
				selectedCategories: [],
				maxProductsPerDay: 30,
				minMarginRate: 40,
				minSalesCount: 200,
				isActive: false,
			});
			await automation.save();
		}

		return {
			success: true,
			automation,
		};
	}

	async createAutomationSettings(automationData: UpdateAutomationDto, userId: string) {
		const automation = new this.automationModel({
			...automationData,
			userId,
		});

		await automation.save();

		return {
			success: true,
			automation,
		};
	}

	async updateAutomationSettings(automationData: UpdateAutomationDto, userId: string) {
		let automation = await this.automationModel.findOne({ userId });

		if (!automation) {
			throw new NotFoundException('Automation settings not found');
		}

		automation = await this.automationModel.findByIdAndUpdate(automation._id, { $set: automationData }, { new: true });

		return {
			success: true,
			automation,
		};
	}

	async startAutomation(userId: string) {
		const automation = await this.automationModel.findOne({ userId });
		if (!automation) {
			throw new NotFoundException('Automation settings not found');
		}

		automation.isActive = true;
		automation.lastRunAt = new Date();
		await automation.save();

		return {
			success: true,
			message: 'Automation started successfully',
			automation,
		};
	}

	async stopAutomation(userId: string) {
		const automation = await this.automationModel.findOne({ userId });
		if (!automation) {
			throw new NotFoundException('Automation settings not found');
		}

		automation.isActive = false;
		await automation.save();

		return {
			success: true,
			message: 'Automation stopped successfully',
			automation,
		};
	}

	async getAutomationStatus(userId: string) {
		const automation = await this.automationModel.findOne({ userId });
		if (!automation) {
			return {
				success: true,
				isActive: false,
				message: 'No automation settings found',
			};
		}

		return {
			success: true,
			isActive: automation.isActive,
			lastRunAt: automation.lastRunAt,
			nextRunAt: automation.nextRunAt,
			automation,
		};
	}
}
