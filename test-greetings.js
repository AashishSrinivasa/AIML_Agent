#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testGreetings() {
  console.log('👋 Testing Greeting Responses\n');
  
  const greetings = [
    'hello',
    'hi',
    'hey',
    'good morning',
    'good afternoon',
    'good evening',
    'greetings'
  ];

  for (const greeting of greetings) {
    console.log(`\n💬 Testing: "${greeting}"`);
    
    try {
      const response = await axios.post(`${API_BASE}/ai/chat`, {
        message: greeting,
        sessionId: 'greeting-test'
      });
      
      const data = response.data.data;
      console.log(`🎯 Intent: ${data.intent}`);
      console.log(`💡 Response: ${data.response}`);
      console.log(`🔗 Suggestions:`, data.suggestions);
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('─'.repeat(60));
  }
}

// Run the test
testGreetings().catch(console.error);
