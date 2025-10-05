#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Google Gemini API for AIML Department AI Agent\n');

console.log('📋 INSTRUCTIONS:');
console.log('1. Go to: https://makersuite.google.com/app/apikey');
console.log('2. Sign in with your Google account');
console.log('3. Click "Create API Key"');
console.log('4. Copy the API key');
console.log('5. Paste it below when prompted\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your Gemini API Key: ', (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    console.log('❌ No API key provided. Please run this script again with a valid API key.');
    rl.close();
    return;
  }

  // Create .env file
  const envContent = `GEMINI_API_KEY=${apiKey.trim()}\n`;
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  
  console.log('✅ API key saved to .env file');
  console.log('🎉 Setup complete! You can now run: node ai-agent.js');
  console.log('\n📝 Note: The .env file contains your API key. Keep it secure and never commit it to version control.');
  
  rl.close();
});
