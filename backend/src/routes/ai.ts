import express, { Request, Response } from 'express';
import { aiService, ChatMessage } from '../services/aiService';
import { asyncHandler } from '../utils/errorHandler';

const router = express.Router();

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Public
router.post('/chat', asyncHandler(async (req: Request, res: Response) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Message is required and must be a string'
    });
  }

  // Validate history format
  if (!Array.isArray(history)) {
    return res.status(400).json({
      success: false,
      error: 'History must be an array'
    });
  }

  // Convert history to proper format
  const messages: ChatMessage[] = [
    ...history.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    })),
    {
      role: 'user',
      content: message
    }
  ];

  try {
    const response = await aiService.generateResponse(messages);
    
    return res.json({
      success: true,
      data: {
        response: response.response,
        sources: response.sources,
        suggestions: response.suggestions,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process your message. Please try again.'
    });
  }
}));

// @desc    Get AI suggestions based on query
// @route   POST /api/ai/suggestions
// @access  Public
router.post('/suggestions', asyncHandler(async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Query is required and must be a string'
    });
  }

  try {
    // Generate suggestions based on query
    const messages: ChatMessage[] = [{
      role: 'user',
      content: query
    }];

    const response = await aiService.generateResponse(messages);
    
    return res.json({
      success: true,
      data: {
        suggestions: response.suggestions || [],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions. Please try again.'
    });
  }
}));

// @desc    Get AI capabilities and help
// @route   GET /api/ai/help
// @access  Public
router.get('/help', asyncHandler(async (req: Request, res: Response) => {
  const capabilities = [
    {
      category: 'Faculty Information',
      description: 'Get information about faculty members, their specializations, research areas, and contact details',
      examples: [
        'Who teaches Machine Learning?',
        'What are Dr. Rajesh Kumar\'s research areas?',
        'Find faculty specializing in Deep Learning'
      ]
    },
    {
      category: 'Course Information',
      description: 'Browse courses, check prerequisites, schedules, and course details',
      examples: [
        'What courses are available in 6th semester?',
        'What are the prerequisites for Deep Learning?',
        'Who teaches Computer Vision?'
      ]
    },
    {
      category: 'Academic Calendar',
      description: 'Check academic schedules, important dates, and examination timetables',
      examples: [
        'When are the mid-term exams?',
        'What are the upcoming holidays?',
        'Show me the examination schedule'
      ]
    },
    {
      category: 'Infrastructure',
      description: 'Explore department labs, equipment, and facilities',
      examples: [
        'What labs are available?',
        'What equipment is in the AI lab?',
        'How many computers are in the computer labs?'
      ]
    }
  ];

  return res.json({
    success: true,
    data: {
      capabilities,
      message: 'I can help you with information about the AIML department at BMSCE University. Ask me anything about faculty, courses, academic calendar, or infrastructure!'
    }
  });
}));

export default router;
