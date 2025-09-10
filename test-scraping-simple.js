const { WorkingScraperService } = require('./dist/modules/scraping/working-scraper.service');

async function testScraping() {
  const scraper = new WorkingScraperService();
  
  try {
    console.log('Testing Coupang scraping...');
    const coupangProducts = await scraper.scrapeCoupangProducts(['아이폰'], 5);
    console.log('Coupang products:', JSON.stringify(coupangProducts, null, 2));
    
    console.log('\nTesting Naver scraping...');
    const naverProducts = await scraper.scrapeNaverProducts(['스마트폰'], 3);
    console.log('Naver products:', JSON.stringify(naverProducts, null, 2));
    
    console.log('\nTesting AliExpress scraping...');
    const aliProducts = await scraper.scrapeAliExpressProducts(['phone'], 3);
    console.log('AliExpress products:', JSON.stringify(aliProducts, null, 2));
    
    console.log('\n✅ All scraping tests passed!');
  } catch (error) {
    console.error('❌ Scraping test failed:', error);
  }
}

testScraping();
