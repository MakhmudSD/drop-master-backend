/**
 * Test script for the enhanced scraping system
 * Run with: node test-scraping.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

async function testScraping() {
  console.log('🧪 Testing Enhanced Scraping System\n');

  try {
    // Test 1: Scrape a Coupang product
    console.log('1. Testing Coupang product scraping...');
    const coupangResponse = await axios.post(`${BASE_URL}/products/scrape`, {
      url: 'https://www.coupang.com/vp/products/123456789',
      source: 'coupang'
    }, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Coupang scraping result:', coupangResponse.data);

    // Test 2: Scrape an AliExpress product (mock)
    console.log('\n2. Testing AliExpress product scraping (mock)...');
    const aliexpressResponse = await axios.post(`${BASE_URL}/products/scrape`, {
      url: 'https://www.aliexpress.com/item/123456789.html',
      source: 'aliexpress'
    }, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ AliExpress scraping result:', aliexpressResponse.data);

    // Test 3: Get all products
    console.log('\n3. Testing get all products...');
    const productsResponse = await axios.get(`${BASE_URL}/products?limit=5`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });
    console.log('✅ Products retrieved:', productsResponse.data);

    // Test 4: Update all products
    console.log('\n4. Testing bulk product update...');
    const updateResponse = await axios.put(`${BASE_URL}/products/update`, {}, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });
    console.log('✅ Bulk update result:', updateResponse.data);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testScraping();
