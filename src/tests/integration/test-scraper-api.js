/**
 * Test script for the Puppeteer-based ScraperApiService
 * Run with: node test-scraper-api.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

async function testScraperApi() {
  console.log('🧪 Testing Puppeteer-based ScraperApiService\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/scraper-api/health`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });
    console.log('✅ Health check result:', healthResponse.data);

    // Test 2: API status
    console.log('\n2. Testing API status...');
    const statusResponse = await axios.get(`${BASE_URL}/scraper-api/status`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });
    console.log('✅ API status result:', statusResponse.data);

    // Test 3: Scrape Coupang products (real Puppeteer scraping)
    console.log('\n3. Testing Coupang scraping with Puppeteer...');
    const coupangResponse = await axios.get(`${BASE_URL}/scraper-api/coupang?keywords=에어팟,무선이어폰&maxResults=3`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });
    console.log('✅ Coupang scraping result:', coupangResponse.data);

    // Test 4: Scrape Naver products (real Puppeteer scraping)
    console.log('\n4. Testing Naver scraping with Puppeteer...');
    const naverResponse = await axios.get(`${BASE_URL}/scraper-api/naver?keywords=스마트폰,케이스&maxResults=3`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });
    console.log('✅ Naver scraping result:', naverResponse.data);

    // Test 5: Custom scraping request
    console.log('\n5. Testing custom scraping request...');
    const customResponse = await axios.post(`${BASE_URL}/scraper-api/scrape`, {
      platform: 'coupang',
      keywords: ['무선충전기', '충전패드'],
      maxResults: 3,
      category: 'electronics',
      sortBy: 'popularity',
      page: 1
    }, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Custom scraping result:', customResponse.data);

    console.log('\n🎉 All Puppeteer-based ScraperApiService tests completed successfully!');
    console.log('\n📝 Note: This service now uses Puppeteer for direct web scraping instead of external APIs.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testScraperApi();
