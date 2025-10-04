import React from 'react';
import { Bot, Users, BookOpen, Calendar, Building2, Target, Award, Lightbulb, MapPin, Phone, Mail } from 'lucide-react';
import BMSCELogo from '../components/BMSCELogo';

const About: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Assistant',
      description: 'Get instant, intelligent responses to your questions about the department'
    },
    {
      icon: Users,
      title: 'Faculty Directory',
      description: 'Comprehensive information about our expert faculty members and their specializations'
    },
    {
      icon: BookOpen,
      title: 'Course Catalog',
      description: 'Detailed course information, prerequisites, and academic planning tools'
    },
    {
      icon: Calendar,
      title: 'Academic Calendar',
      description: 'Stay updated with important dates, events, and examination schedules'
    },
    {
      icon: Building2,
      title: 'Infrastructure',
      description: 'Explore our state-of-the-art labs, equipment, and research facilities'
    }
  ];

  const stats = [
    { label: 'Faculty Members', value: '5+', icon: Users },
    { label: 'Courses Available', value: '5+', icon: BookOpen },
    { label: 'Research Areas', value: '15+', icon: Lightbulb },
    { label: 'Labs & Facilities', value: '10+', icon: Building2 }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="flex justify-center mb-6">
          <BMSCELogo size="xl" variant="full" className="text-center" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About AIML Department AI Assistant
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Your intelligent companion for navigating the Artificial Intelligence and Machine Learning department at B.M.S. College of Engineering
        </p>
        
        {/* College Information */}
        <div className="bg-blue-50 rounded-xl p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">B.M.S. College of Engineering</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-sm text-gray-600">Bull Temple Road, Basavanagudi, Bangalore - 560019</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Contact</h3>
                <p className="text-sm text-gray-600">+91-80-26622130</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-sm text-gray-600">info@bmsce.ac.in</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            To provide students, faculty, and visitors with instant access to comprehensive information about our department through cutting-edge AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Accessibility</h3>
            <p className="text-gray-600">Making department information easily accessible to everyone</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
            <p className="text-gray-600">Delivering accurate and up-to-date information</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">Leveraging AI to enhance the academic experience</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover what makes our AI assistant special
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Department Overview</h2>
          <p className="text-xl text-blue-100">Numbers that speak for our excellence</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology Stack</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built with modern technologies for optimal performance and user experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">React</span>
            </div>
            <h3 className="font-semibold text-gray-900">Frontend</h3>
            <p className="text-sm text-gray-600">React.js with TypeScript</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">Node</span>
            </div>
            <h3 className="font-semibold text-gray-900">Backend</h3>
            <p className="text-sm text-gray-600">Node.js with Express</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">AI</span>
            </div>
            <h3 className="font-semibold text-gray-900">AI Engine</h3>
            <p className="text-sm text-gray-600">OpenAI GPT Integration</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 font-bold">DB</span>
            </div>
            <h3 className="font-semibold text-gray-900">Database</h3>
            <p className="text-sm text-gray-600">MongoDB</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50 rounded-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:aiml@bmsce.ac.in"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Contact Department
            </a>
            <a
              href="/chat"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              Try AI Assistant
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
