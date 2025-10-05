import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Loader2, MessageCircle, Sparkles, Zap, Brain, Star } from 'lucide-react';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { aiApi, facultyApi } from '../services/api.ts';
import { ChatMessage } from '../types/index.ts';
import MarkdownRenderer from '../components/MarkdownRenderer.tsx';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: helpData } = useQuery('ai-help', aiApi.getHelp);
  const { data: facultyData } = useQuery('faculty', facultyApi.getAll);

  // Generate autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!inputMessage.trim() || inputMessage.length < 2) return [];
    
    const searchTerm = inputMessage.toLowerCase();
    const suggestionsList: string[] = [];
    
    // Faculty name suggestions
    if (facultyData?.data && Array.isArray(facultyData.data)) {
      facultyData.data.forEach(faculty => {
        if (faculty.name.toLowerCase().includes(searchTerm)) {
          suggestionsList.push(`Tell me about ${faculty.name}`);
        }
        if (faculty.name.toLowerCase().startsWith(searchTerm)) {
          suggestionsList.push(`Who is ${faculty.name}?`);
        }
      });
    }
    
    // Common question patterns
    const commonPatterns = [
      'Who teaches',
      'What courses',
      'Tell me about',
      'What labs',
      'When are',
      'What equipment',
      'Who specializes in',
      'What are the prerequisites',
      'What is',
      'How to',
      'Where is',
      'When is'
    ];
    
    commonPatterns.forEach(pattern => {
      if (pattern.toLowerCase().includes(searchTerm)) {
        suggestionsList.push(pattern);
      }
    });
    
    // Specialization suggestions
    const specializations = [
      'Machine Learning', 'Deep Learning', 'Natural Language Processing',
      'Computer Vision', 'Data Science', 'Artificial Intelligence',
      'Neural Networks', 'Reinforcement Learning', 'Data Mining'
    ];
    
    specializations.forEach(spec => {
      if (spec.toLowerCase().includes(searchTerm)) {
        suggestionsList.push(`Who teaches ${spec}?`);
        suggestionsList.push(`What courses cover ${spec}?`);
      }
    });
    
    return [...new Set(suggestionsList)].slice(0, 5);
  }, [inputMessage, facultyData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message:', inputMessage.trim());
      const response = await aiApi.chat(inputMessage.trim(), messages);
      console.log('API Response:', response);
      
      if (response.data) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
          sources: response.data.sources,
          suggestions: response.data.suggestions
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        console.error('API Error:', response.error);
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast.error(`Failed to send message: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        setInputMessage(suggestions[selectedSuggestionIndex]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      } else {
        handleSendMessage();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    setShowSuggestions(e.target.value.length >= 2);
    setSelectedSuggestionIndex(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  };

  const suggestedQuestions = [
    "Who teaches Deep Learning?",
    "What courses are available in semester 5?",
    "Tell me about Dr. Monika Puttaramaiah's research",
    "What labs are available for AI research?",
    "When are the semester exams scheduled?",
    "What equipment is available in ML Lab 1?",
    "Who specializes in Natural Language Processing?",
    "What are the prerequisites for Machine Learning course?"
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-full max-w-5xl mx-auto p-4 flex flex-col"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden flex flex-col h-full">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-8 overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12"></div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex items-center space-x-4"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-white/50"
                />
                <Brain className="w-8 h-8 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-2 h-2 text-white" />
                </motion.div>
              </motion.div>
              
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center space-x-2 mb-1"
                >
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                    LIAM
                  </h1>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Zap className="w-6 h-6 text-yellow-300" />
                  </motion.div>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-purple-100 text-lg font-medium"
                >
                  Your AI companion for AIML Department
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                      >
                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-purple-200 text-sm">Powered by Gemini AI</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white/50 to-purple-50/30 dark:from-gray-800/50 dark:to-purple-900/30 min-h-0">
            {messages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
                  className="relative w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-3xl border-4 border-transparent border-t-white/50"
                  />
                  <Brain className="w-12 h-12 text-white" />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </motion.div>
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
                >
                  Hey there! I'm LIAM ✨
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto leading-relaxed"
                >
                  Your AI companion for the AIML Department! I'm here to help you with everything about our amazing department - from faculty info to course details, lab equipment, and more! 🚀
                </motion.p>
              
                {helpData?.data?.capabilities && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-left max-w-4xl mx-auto mb-8"
                  >
                    <motion.h4 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="font-bold text-xl text-gray-800 dark:text-white mb-6 flex items-center space-x-2"
                    >
                      <Zap className="w-5 h-5 text-purple-500" />
                      <span>What I can do for you:</span>
                    </motion.h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {helpData.data.capabilities.map((capability: any, index: number) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.1, type: "spring", bounce: 0.3 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <h5 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                            <span>{capability.category}</span>
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{capability.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="mt-8"
                >
                  <motion.h4 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="font-bold text-xl text-gray-800 dark:text-white mb-6 flex items-center space-x-2"
                  >
                    <Sparkles className="w-5 h-5 text-pink-500" />
                    <span>Try asking me:</span>
                  </motion.h4>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {suggestedQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.1 + index * 0.1, type: "spring", bounce: 0.4 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSuggestionClick(question)}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/70 dark:hover:to-pink-800/70 transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50 shadow-md hover:shadow-lg"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.1, type: "spring", bounce: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-xs lg:max-w-3xl px-6 py-4 rounded-3xl transition-all duration-300 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-12'
                        : 'bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-gray-200 mr-12 border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.role === 'assistant' && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        >
                          <Brain className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm leading-relaxed">
                          <MarkdownRenderer content={message.content} />
                        </div>
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-purple-200/50 dark:border-purple-700/50">
                            <p className="text-xs text-purple-600 dark:text-purple-400 mb-2 font-medium flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Sources:</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {message.sources.map((source, index) => (
                                <span
                                  key={index}
                                  className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium border border-purple-200/50 dark:border-purple-700/50"
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-purple-200/50 dark:border-purple-700/50">
                            <p className="text-xs text-purple-600 dark:text-purple-400 mb-3 font-medium flex items-center space-x-1">
                              <Zap className="w-3 h-3" />
                              <span>Quick questions:</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <motion.button
                                  key={index}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-full text-xs font-medium hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/70 dark:hover:to-pink-800/70 transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50 shadow-sm hover:shadow-md"
                                >
                                  {suggestion}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                        >
                          <User className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              className="flex justify-start"
            >
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-gray-200 px-6 py-4 rounded-3xl shadow-lg border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm mr-12"
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
                  >
                    <Brain className="w-4 h-4 text-white" />
                  </motion.div>
                  <div className="flex space-x-1">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                    ></motion.div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-pink-400 rounded-full"
                    ></motion.div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-indigo-400 rounded-full"
                    ></motion.div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">LIAM is thinking...</span>
                </div>
              </motion.div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

          {/* Input */}
          <div className="border-t border-purple-200/50 dark:border-purple-700/50 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex-shrink-0">
            <div className="relative">
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <motion.input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    onFocus={() => setShowSuggestions(inputMessage.length >= 2)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Ask LIAM anything about the AIML department... ✨"
                    className="w-full border-2 border-purple-200/50 dark:border-purple-700/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                    whileFocus={{ scale: 1.02 }}
                  />
                
                  {/* Autocomplete Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-700/95 backdrop-blur-xl border border-purple-200/50 dark:border-purple-700/50 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto"
                      >
                        {suggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`px-4 py-3 cursor-pointer text-sm transition-all duration-200 ${
                              index === selectedSuggestionIndex
                                ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-900 dark:text-purple-100'
                                : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-900 dark:text-gray-100'
                            } ${index === 0 ? 'rounded-t-2xl' : ''} ${
                              index === suggestions.length - 1 ? 'rounded-b-2xl' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <Sparkles className="w-3 h-3 text-purple-500" />
                              <span>{suggestion}</span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              
              {/* Suggestion hint */}
              {showSuggestions && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-xs text-purple-600 dark:text-purple-400 flex items-center space-x-2"
                >
                  <Zap className="w-3 h-3" />
                  <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
