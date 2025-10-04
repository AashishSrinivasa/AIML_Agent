const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'AIML Department AI Agent Backend is running!'
  });
});

// Mock data endpoints
app.get('/api/faculty', (req, res) => {
  res.json({
    success: true,
    count: 5,
    data: [
      {
        id: "faculty_001",
        name: "Dr. Rajesh Kumar",
        designation: "Professor & Head",
        specialization: ["Deep Learning", "Computer Vision"],
        email: "rajesh.kumar@bmsce.ac.in"
      }
    ]
  });
});

app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    count: 5,
    data: [
      {
        id: "course_001",
        code: "AIML301",
        name: "Machine Learning",
        credits: 4,
        semester: "5th"
      }
    ]
  });
});

app.post('/api/ai/chat', (req, res) => {
  res.json({
    success: true,
    data: {
      response: "Hello! I'm the AIML Department AI Assistant. I can help you with information about faculty, courses, and more!",
      sources: ["AI Assistant"],
      suggestions: ["Ask about faculty", "Browse courses", "Check calendar"],
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
