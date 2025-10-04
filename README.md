# AIML Department AI Agent

A comprehensive AI-powered assistant for the AIML department at BMSCE University. This application provides intelligent responses to queries about faculty, courses, academic calendar, and infrastructure through an advanced chat interface.

## 🚀 Features

### Core Functionality
- **AI-Powered Chat Interface**: Intelligent responses using OpenAI GPT integration
- **Faculty Directory**: Comprehensive information about faculty members, their specializations, and research areas
- **Course Catalog**: Detailed course information, prerequisites, and academic planning tools
- **Academic Calendar**: Important dates, events, and examination schedules
- **Infrastructure Explorer**: State-of-the-art labs, equipment, and research facilities
- **Real-time Search**: Advanced filtering and search capabilities across all data

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **API Integration**: RESTful API with comprehensive error handling
- **Data Visualization**: Interactive charts and statistics
- **Performance Optimized**: Efficient data loading and caching

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **React Router** for navigation
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **OpenAI API** for AI responses
- **Express Rate Limiting** for API protection
- **Helmet** for security headers
- **CORS** for cross-origin requests

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- OpenAI API key
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aiml-department-ai-agent
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/aiml_department
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup
Start MongoDB service and seed the database:
```bash
cd backend
npm run seed
```

### 5. Start Development Servers

Backend (Terminal 1):
```bash
cd backend
npm run dev
```

Frontend (Terminal 2):
```bash
cd frontend
npm start
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📚 API Documentation

### Faculty Endpoints
- `GET /api/faculty` - Get all faculty members
- `GET /api/faculty/:id` - Get faculty by ID
- `GET /api/faculty/designation/:designation` - Get faculty by designation
- `GET /api/faculty/specialization/:specialization` - Get faculty by specialization
- `GET /api/faculty/stats/overview` - Get faculty statistics

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/semester/:semester` - Get courses by semester
- `GET /api/courses/instructor/:instructor` - Get courses by instructor
- `GET /api/courses/stats/overview` - Get course statistics

### Calendar Endpoints
- `GET /api/calendar` - Get academic calendar
- `GET /api/calendar/events/:type` - Get events by type
- `GET /api/calendar/upcoming` - Get upcoming events
- `GET /api/calendar/exams` - Get examination schedule

### Infrastructure Endpoints
- `GET /api/infrastructure` - Get infrastructure details
- `GET /api/infrastructure/labs` - Get labs information
- `GET /api/infrastructure/research` - Get research facilities
- `GET /api/infrastructure/stats` - Get infrastructure statistics

### AI Endpoints
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/suggestions` - Get AI suggestions
- `GET /api/ai/help` - Get AI capabilities

## 🎯 Usage Examples

### Chat Interface
Ask the AI assistant questions like:
- "Who teaches Machine Learning?"
- "What courses are available in 6th semester?"
- "When are the mid-term exams?"
- "What labs are available in the department?"
- "Tell me about Dr. Rajesh Kumar's research areas"

### Faculty Search
- Search by name, specialization, or research area
- Filter by designation (Professor, Associate Professor, etc.)
- View detailed profiles with contact information

### Course Browsing
- Browse courses by semester
- Check prerequisites and course descriptions
- View instructor information and schedules

### Calendar Management
- View upcoming events and deadlines
- Check examination schedules
- Filter events by type (academic, holiday, exam, etc.)

## 🏗️ Project Structure

```
aiml-department-ai-agent/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── scripts/        # Database seeding
│   ├── data/              # JSON data files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

## 🔧 Development

### Adding New Features
1. Create models in `backend/src/models/`
2. Add routes in `backend/src/routes/`
3. Implement services in `backend/src/services/`
4. Create components in `frontend/src/components/`
5. Add pages in `frontend/src/pages/`

### Database Management
- Seed data: `npm run seed`
- Clear data: Drop the MongoDB database
- Update data: Modify JSON files in `data/` directory

## 🚀 Deployment

### Backend Deployment
1. Build the project: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Update API URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: aiml@bmsce.ac.in
- Create an issue in the repository
- Use the AI chat interface for quick help

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with university systems
- [ ] Multi-language support
- [ ] Voice interface integration
