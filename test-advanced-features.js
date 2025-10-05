#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testAdvancedFeatures() {
  console.log('🚀 Testing Advanced Gemini Features\n');
  
  const testCases = [
    {
      name: 'Career Guidance',
      message: 'I want to become a data scientist. What should I study?',
      sessionId: 'test-session-1'
    },
    {
      name: 'Course Pathway',
      message: 'What courses should I take in 3rd semester to prepare for machine learning?',
      sessionId: 'test-session-1'
    },
    {
      name: 'Faculty Matching',
      message: 'Who teaches computer vision courses?',
      sessionId: 'test-session-1'
    },
    {
      name: 'Context Memory',
      message: 'What are their research areas?',
      sessionId: 'test-session-1'
    },
    {
      name: 'Prerequisite Analysis',
      message: 'What do I need to know before taking Deep Learning?',
      sessionId: 'test-session-2'
    },
    {
      name: 'Infrastructure Query',
      message: 'What equipment is available for AI research?',
      sessionId: 'test-session-2'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`💬 Message: "${testCase.message}"`);
    
    try {
      const response = await axios.post(`${API_BASE}/ai/chat`, {
        message: testCase.message,
        sessionId: testCase.sessionId
      });
      
      const data = response.data.data;
      console.log(`🎯 Intent: ${data.intent}`);
      console.log(`📊 Extracted Info:`, data.extractedInfo);
      console.log(`💡 Response: ${data.response.substring(0, 200)}...`);
      console.log(`🔗 Suggestions:`, data.suggestions);
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('─'.repeat(80));
  }
}

// Run the test
testAdvancedFeatures().catch(console.error);
