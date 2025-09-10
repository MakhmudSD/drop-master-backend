import { Controller, Get, Post, Body, Patch, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { AutomationService } from './automation.service';
import { UpdateAutomationDto } from '../../shared/dto/update-automation.dto';
@Controller('automation')
@UseGuards(JwtAuthGuard)
export class AutomationController {
	constructor(private automationService: AutomationService) {}

	@Get()
	async getAutomationSettings(@Request() req) {
		return this.automationService.getAutomationSettings(req.user.userId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createAutomationSettings(@Body() automationData: UpdateAutomationDto, @Request() req) {
		return this.automationService.createAutomationSettings(automationData, req.user.userId);
	}

	@Patch()
	@HttpCode(HttpStatus.OK)
	async updateAutomationSettings(@Body() automationData: UpdateAutomationDto, @Request() req) {
		return this.automationService.updateAutomationSettings(automationData, req.user.userId);
	}

	@Post('start')
	@HttpCode(HttpStatus.OK)
	async startAutomation(@Request() req) {
		return this.automationService.startAutomation(req.user.userId);
	}

	@Post('stop')
	@HttpCode(HttpStatus.OK)
	async stopAutomation(@Request() req) {
		return this.automationService.stopAutomation(req.user.userId);
	}

	@Get('status')
	async getAutomationStatus(@Request() req) {
		return this.automationService.getAutomationStatus(req.user.userId);
	}
}
