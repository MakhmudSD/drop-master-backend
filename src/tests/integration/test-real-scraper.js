const axios = require('axios');

async function testRealScraper() {
  console.log('🧪 Testing Real Scraper Service...\n');

  try {
    // Test Coupang
    console.log('📱 Testing Coupang scraping...');
    const coupangResponse = await axios.get('http://localhost:3001/api/test-scraper/coupang?limit=3');
    console.log('✅ Coupang:', coupangResponse.data.count, 'products found');
    console.log('   Sample product:', coupangResponse.data.products[0]?.title);
    console.log('');

    // Test Naver
    console.log('🛒 Testing Naver scraping...');
    const naverResponse = await axios.get('http://localhost:3001/api/test-scraper/naver?limit=3');
    console.log('✅ Naver:', naverResponse.data.count, 'products found');
    console.log('   Sample product:', naverResponse.data.products[0]?.title);
    console.log('');

    // Test All Platforms
    console.log('🌐 Testing all platforms...');
    const allResponse = await axios.get('http://localhost:3001/api/test-scraper/all?limit=2');
    console.log('✅ All platforms test completed');
    
    Object.entries(allResponse.data.results).forEach(([platform, result]) => {
      if (result.success) {
        console.log(`   ${platform}: ${result.count} products`);
      } else {
        console.log(`   ${platform}: ERROR - ${result.error}`);
      }
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the test
testRealScraper();
