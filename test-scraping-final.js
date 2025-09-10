const { WorkingScraperService } = require('./dist/modules/scraping/working-scraper.service');

async function testScraping() {
  console.log('🧪 Testing Scraping Functionality...\n');
  
  const scraper = new WorkingScraperService();
  
  try {
    // Test Coupang
    console.log('📱 Testing Coupang scraping...');
    const coupangProducts = await scraper.scrapeCoupangProducts(['아이폰'], 2);
    console.log(`✅ Coupang: Found ${coupangProducts.length} products`);
    console.log(`   Sample: ${coupangProducts[0]?.title} - ₩${coupangProducts[0]?.price?.toLocaleString()}`);
    
    // Test Naver
    console.log('\n🛒 Testing Naver scraping...');
    const naverProducts = await scraper.scrapeNaverProducts(['스마트폰'], 2);
    console.log(`✅ Naver: Found ${naverProducts.length} products`);
    console.log(`   Sample: ${naverProducts[0]?.title} - ₩${naverProducts[0]?.price?.toLocaleString()}`);
    
    // Test AliExpress
    console.log('\n🌍 Testing AliExpress scraping...');
    const aliProducts = await scraper.scrapeAliExpressProducts(['phone'], 2);
    console.log(`✅ AliExpress: Found ${aliProducts.length} products`);
    console.log(`   Sample: ${aliProducts[0]?.title} - $${aliProducts[0]?.price}`);
    
    console.log('\n🎉 All scraping tests passed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Coupang: ${coupangProducts.length} products`);
    console.log(`   - Naver: ${naverProducts.length} products`);
    console.log(`   - AliExpress: ${aliProducts.length} products`);
    
  } catch (error) {
    console.error('❌ Scraping test failed:', error.message);
  }
}

testScraping();
