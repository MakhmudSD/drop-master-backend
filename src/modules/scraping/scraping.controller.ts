import { Controller, Post, Get, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapeProductsDto } from '../../shared/dto/scrape-products.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@Controller('scrape')
@UseGuards(JwtAuthGuard)
export class ScrapingController {
	constructor(private scrapingService: ScrapingService) {}

	@Post('coupang')
	@HttpCode(HttpStatus.OK)
	async scrapeCoupang(@Body() scrapeDto: ScrapeProductsDto, @Request() req) {
		return this.scrapingService.scrapeCoupang(scrapeDto, req.user.userId);
	}

	@Post('naver')
	@HttpCode(HttpStatus.OK)
	async scrapeNaver(@Body() scrapeDto: ScrapeProductsDto, @Request() req) {
		return this.scrapingService.scrapeNaver(scrapeDto, req.user.userId);
	}

	@Post('11st')
	@HttpCode(HttpStatus.OK)
	async scrape11st(@Body() scrapeDto: ScrapeProductsDto, @Request() req) {
		return this.scrapingService.scrape11st(scrapeDto, req.user.userId);
	}

	@Post('aliexpress')
	@HttpCode(HttpStatus.OK)
	async scrapeAliExpress(@Body() scrapeDto: ScrapeProductsDto, @Request() req) {
		return this.scrapingService.scrapeAliExpress(scrapeDto, req.user.userId);
	}

	@Post('alibaba')
	@HttpCode(HttpStatus.OK)
	async scrapeAlibaba(@Body() scrapeDto: ScrapeProductsDto, @Request() req) {
		return this.scrapingService.scrapeAlibaba(scrapeDto, req.user.userId);
	}

	@Get('status/:runId')
	async getScrapingStatus(@Param('runId') runId: string) {
		return this.scrapingService.getScrapingStatus(runId);
	}

	@Get('results/:runId')
	async getScrapingResults(@Param('runId') runId: string) {
		return this.scrapingService.getScrapingResults(runId);
	}

	@Post('process/:runId')
	async processScrapingResults(@Param('runId') runId: string, @Body() processData: any, @Request() req) {
		return this.scrapingService.processScrapingResults(runId, processData, req.user.userId);
	}

	@Get('history')
	async getScrapingHistory(@Request() req) {
		return this.scrapingService.getScrapingHistory(req.user.userId);
	}

	@Post('stop/:runId')
	async stopScraping(@Param('runId') runId: string) {
		return this.scrapingService.stopScraping(runId);
	}
}
