# AIML Department AI Agent - BMSCE

A comprehensive AI-powered web application for the Artificial Intelligence and Machine Learning Department at B.M.S. College of Engineering. Features an intelligent chatbot (LIAM) powered by Google Gemini AI, faculty management, course catalog, academic calendar, and infrastructure information.

## 🚀 Features

- **AI Chatbot (LIAM)**: Intelligent assistant powered by Google Gemini AI
- **Faculty Directory**: Complete faculty information with search and filtering
- **Course Catalog**: Comprehensive course details for all semesters (3rd to 8th)
- **Academic Calendar**: Event management and academic schedule
- **Infrastructure**: Department facilities and lab information
- **Admin Panel**: Protected interface for managing department data
- **Modern UI**: Gen Z aesthetic with glassmorphism and animations
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Query** for data fetching
- **React Router** for navigation
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **Google Gemini AI** for chatbot intelligence
- **JSON file-based data storage**
- **CORS enabled** for cross-origin requests

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Google Cloud Account** with Gemini AI API access

## 🔧 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/aiml-department-ai-agent.git
cd aiml-department-ai-agent
```

### Step 2: Install Dependencies

#### Backend Dependencies
```bash
npm install
```

#### Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Environment Setup

1. **Create a `.env` file in the root directory:**
```bash
touch .env
```

2. **Add your Google Gemini API key to the `.env` file:**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create a new project or select existing one
   - Generate an API key
   - Copy the key and paste it in your `.env` file

### Step 4: Verify File Structure

Ensure your project structure looks like this:
```
aiml-department-ai-agent/
├── frontend/
│   ├── public/
│   │   ├── logo.png
│   │   └── assets/
│   │       └── hod.png
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
├── data/
│   ├── comprehensive_faculty.json
│   ├── comprehensive_courses.json
│   ├── comprehensive_academic_calendar.json
│   └── comprehensive_infrastructure.json
├── ai-agent.js
├── package.json
├── .env
└── README.md
```

## 🚀 Running the Application

### Method 1: Using Terminal Commands

1. **Start the AI Agent Server (Backend):**
```bash
node ai-agent.js
```
The server will start on `http://localhost:5001`

2. **Start the Frontend (in a new terminal):**
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

### Method 2: Using VS Code

#### Step-by-Step VS Code Setup:

1. **Open VS Code:**
   - Open VS Code
   - Click `File` → `Open Folder`
   - Select the `aiml-department-ai-agent` folder

2. **Install VS Code Extensions (Recommended):**
   - **ES7+ React/Redux/React-Native snippets**
   - **Tailwind CSS IntelliSense**
   - **TypeScript Importer**
   - **Auto Rename Tag**
   - **Bracket Pair Colorizer**

3. **Open Integrated Terminal:**
   - Press `Ctrl+`` (backtick) or `Cmd+`` on Mac
   - Or go to `Terminal` → `New Terminal`

4. **Start Backend Server:**
   ```bash
   node ai-agent.js
   ```
   - Keep this terminal open
   - You should see: `🚀 AI Agent server running on port 5001`

5. **Open New Terminal Tab:**
   - Click the `+` button in the terminal panel
   - Or press `Ctrl+Shift+`` (backtick)

6. **Navigate to Frontend and Start:**
   ```bash
   cd frontend
   npm start
   ```
   - This will open your browser automatically
   - You should see: `Compiled successfully!`

7. **Access the Application:**
   - Open your browser
   - Go to `http://localhost:3000`

## 🎯 Usage Guide

### For Students:
- **Home Page**: Overview and quick access to chat
- **Faculty**: Browse and search faculty information
- **Courses**: Explore course catalog by semester
- **Calendar**: View academic events and schedules
- **Infrastructure**: Check department facilities
- **Chat**: Ask LIAM (AI assistant) any questions

### For Administrators:
- **Admin Panel**: Access with password `Aashish@15`
- **Add/Edit Faculty**: Manage faculty information
- **Add/Edit Courses**: Update course details
- **Data Management**: All changes are saved automatically

## 🔧 Troubleshooting

### Common Issues:

1. **"Cannot read properties of undefined" errors:**
   - Ensure both servers are running
   - Check if API endpoints are accessible
   - Restart both servers

2. **Gemini API errors:**
   - Verify your API key in `.env` file
   - Check Google Cloud billing
   - Ensure API is enabled in Google Cloud Console

3. **Port already in use:**
   ```bash
   # Kill processes on ports 3000 and 5001
   npx kill-port 3000
   npx kill-port 5001
   ```

4. **Dependencies issues:**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

5. **Images not loading:**
   - Ensure `logo.png` and `hod.png` are in correct directories
   - Check file permissions
   - Restart the development server

### VS Code Specific Issues:

1. **TypeScript errors:**
   - Press `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

2. **IntelliSense not working:**
   - Reload VS Code window: `Ctrl+Shift+P` → "Developer: Reload Window"

3. **Terminal not working:**
   - Check if Node.js is in PATH
   - Restart VS Code

## 📁 Project Structure

```
aiml-department-ai-agent/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   │   ├── logo.png         # BMSCE logo
│   │   └── assets/
│   │       └── hod.png      # HOD image
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── BMSCELogo.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── MarkdownRenderer.tsx
│   │   ├── pages/           # Main application pages
│   │   │   ├── Home.tsx
│   │   │   ├── Chat.tsx
│   │   │   ├── Faculty.tsx
│   │   │   ├── Courses.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Infrastructure.tsx
│   │   │   ├── About.tsx
│   │   │   └── Admin.tsx
│   │   ├── services/        # API services
│   │   │   └── api.ts
│   │   ├── App.tsx          # Main app component
│   │   └── index.tsx        # Entry point
│   └── package.json
├── data/                    # JSON data files
│   ├── comprehensive_faculty.json
│   ├── comprehensive_courses.json
│   ├── comprehensive_academic_calendar.json
│   └── comprehensive_infrastructure.json
├── ai-agent.js             # Main backend server
├── package.json            # Backend dependencies
├── .env                    # Environment variables
└── README.md              # This file
```

## 🔐 Admin Access

- **URL**: `http://localhost:3000/admin`
- **Password**: `Aashish@15`
- **Features**: Add, edit, delete faculty and courses

## 🌟 Key Features Explained

### LIAM AI Assistant
- Powered by Google Gemini AI
- Context-aware responses
- Department-specific knowledge
- Natural conversation flow

### Modern UI Design
- Glassmorphism effects
- Smooth animations with Framer Motion
- Responsive design
- Gen Z aesthetic

### Data Management
- JSON-based storage
- Real-time updates
- Admin panel for content management
- Search and filtering capabilities

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Verify your API keys are correct
4. Check the console for error messages

## 🚀 Deployment

For production deployment:
1. Build the frontend: `cd frontend && npm run build`
2. Set up environment variables on your server
3. Use a process manager like PM2 for the backend
4. Configure your web server (nginx/Apache) for the frontend

## 📄 License

This project is created for educational purposes at B.M.S. College of Engineering.

---

**Happy Coding! 🎉**

For any questions or issues, please refer to the troubleshooting section or check the project documentation.