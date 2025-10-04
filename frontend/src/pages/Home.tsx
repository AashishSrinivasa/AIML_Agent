import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Users, 
  BookOpen, 
  Calendar, 
  Building2, 
  MessageCircle,
  ArrowRight,
  Sparkles,
  GraduationCap,
  TrendingUp
} from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI Chat Assistant',
      description: 'Get instant answers about faculty, courses, and academic information',
      link: '/chat',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Faculty Directory',
      description: 'Explore our expert faculty members and their specializations',
      link: '/faculty',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BookOpen,
      title: 'Course Catalog',
      description: 'Browse comprehensive course information and prerequisites',
      link: '/courses',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Calendar,
      title: 'Academic Calendar',
      description: 'Stay updated with important dates and examination schedules',
      link: '/calendar',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Building2,
      title: 'Infrastructure',
      description: 'Discover our state-of-the-art labs and facilities',
      link: '/infrastructure',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  const stats = [
    { label: 'Faculty Members', value: '5+', icon: Users },
    { label: 'Courses Available', value: '5+', icon: BookOpen },
    { label: 'Research Areas', value: '15+', icon: TrendingUp },
    { label: 'Labs & Facilities', value: '10+', icon: Building2 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AIML Department
              <span className="block text-yellow-300">AI Assistant</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Your intelligent companion for navigating the Artificial Intelligence and Machine Learning department at BMSCE University
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/chat"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Chatting</span>
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive information and AI-powered assistance for all your academic needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience the future of academic assistance with our AI-powered platform
          </p>
          <Link
            to="/chat"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Start Your Journey</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
