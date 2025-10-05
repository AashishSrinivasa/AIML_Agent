# 🚀 Google Gemini API Setup Guide

## Quick Setup (Recommended)

1. **Run the setup script:**
   ```bash
   node setup-gemini.js
   ```

2. **Follow the prompts** to enter your API key

3. **Start the AI agent:**
   ```bash
   node ai-agent.js
   ```

## Manual Setup

### Step 1: Get Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated API key

### Step 2: Set Environment Variable

Create a `.env` file in the project root:

```bash
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

Replace `your_api_key_here` with your actual API key.

### Step 3: Start the AI Agent

```bash
node ai-agent.js
```

## 🎯 Benefits of Google Gemini

- ✅ **100% FREE** with generous limits
- ✅ **Fast and reliable** responses
- ✅ **Excellent instruction following**
- ✅ **No local setup required**
- ✅ **Professional quality** responses

## 📊 API Limits (Free Tier)

- **15 requests per minute**
- **1 million tokens per day**
- **Perfect for college projects**

## 🔧 Troubleshooting

### "GEMINI_API_KEY not found"
- Make sure you have a `.env` file in the project root
- Check that the API key is correctly set in the `.env` file

### "API key invalid"
- Verify your API key is correct
- Make sure you copied the entire key without extra spaces

### Rate limit exceeded
- Wait a minute before making more requests
- The free tier allows 15 requests per minute

## 🎉 You're Ready!

Once set up, your AI agent will use Google Gemini for intelligent, conversational responses about your AIML department!
