#!/bin/bash

echo "🚀 Setting up Llama LLM for AIML Department AI Agent"
echo "=================================================="

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "📦 Installing Ollama..."
    
    # Install Ollama based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        curl -fsSL https://ollama.ai/install.sh | sh
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        echo "❌ Unsupported OS. Please install Ollama manually from https://ollama.ai"
        exit 1
    fi
else
    echo "✅ Ollama is already installed"
fi

# Start Ollama service
echo "🔄 Starting Ollama service..."
ollama serve &
OLLAMA_PID=$!

# Wait for Ollama to start
sleep 5

# Pull Llama 3.2 3B model (free and lightweight)
echo "📥 Downloading Llama 3.2 3B model (this may take a few minutes)..."
ollama pull llama3.2:3b

# Test the model
echo "🧪 Testing Llama model..."
ollama run llama3.2:3b "Hello, I'm ready to help with AIML department questions!"

echo ""
echo "✅ Llama LLM setup complete!"
echo "🎯 Your AI agent will now use Llama for much better responses"
echo "📊 Benefits:"
echo "   - More natural, conversational responses"
echo "   - Better understanding of complex questions"
echo "   - Improved context awareness"
echo "   - Professional, helpful tone"
echo ""
echo "🚀 You can now start your AI agent with: node ai-agent.js"
echo "💡 The agent will automatically use Llama when available, with fallback to rule-based responses"
