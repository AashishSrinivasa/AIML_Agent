# 🔑 Get Your FREE Gemini API Key

## Quick Steps:

### 1. Go to Google AI Studio
Visit: **https://makersuite.google.com/app/apikey**

### 2. Sign In
- Use your Google account to sign in
- If you don't have a Google account, create one (it's free)

### 3. Create API Key
- Click **"Create API Key"** button
- Select **"Create API key in new project"** or use existing project
- Copy the generated API key (starts with `AIzaSy...`)

### 4. Set Up the API Key
Run this command in your terminal:
```bash
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
```

Replace `your_actual_api_key_here` with the API key you copied.

### 5. Start the AI Agent
```bash
node ai-agent.js
```

## 🎯 Why You Need This:
- **100% FREE** - No costs ever
- **15 requests per minute** - Perfect for your project
- **1 million tokens per day** - More than enough
- **No credit card required**

## 🚀 Alternative: Use the Setup Script
```bash
node setup-gemini.js
```
Then paste your API key when prompted.

## ✅ Test It Works
After setting up, test with:
```bash
curl -s http://localhost:5001/api/ai/chat -X POST -H "Content-Type: application/json" -d '{"message": "hello"}' | jq '.data.response'
```

You should see a proper Gemini response instead of fallback!
