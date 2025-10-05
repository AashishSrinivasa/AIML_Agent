#!/usr/bin/env node

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiConnection() {
  console.log('🧪 Testing Gemini API Connection\n');
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ GEMINI_API_KEY not found in environment variables');
    console.log('📋 Please run: node setup-gemini.js to set up your API key');
    return;
  }
  
  if (apiKey === 'AIzaSyBvQZvQZvQZvQZvQZvQZvQZvQZvQZvQZvQ') {
    console.log('❌ Using placeholder API key');
    console.log('📋 Please get a real API key from: https://makersuite.google.com/app/apikey');
    return;
  }
  
  console.log('✅ API Key found:', apiKey.substring(0, 20) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    console.log('🔄 Testing API call...');
    
    const result = await model.generateContent("Hello, respond with 'Gemini is working!'");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API is working!');
    console.log('📝 Response:', text);
    
  } catch (error) {
    console.log('❌ Gemini API Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('💡 Your API key is invalid. Please get a new one from: https://makersuite.google.com/app/apikey');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.log('💡 API quota exceeded. Please try again later.');
    } else {
      console.log('💡 Check your internet connection and try again.');
    }
  }
}

testGeminiConnection().catch(console.error);
