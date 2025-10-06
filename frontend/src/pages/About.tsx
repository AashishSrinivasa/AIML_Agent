import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Users, BookOpen, Calendar, Building2, Target, Award, Lightbulb, Phone, Mail, Brain, Cpu, Sparkles, GraduationCap, Microscope, Code, Database } from 'lucide-react';
import BMSCELogo from '../components/BMSCELogo.tsx';

const About: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: 'LIAM AI Assistant',
      description: 'Your intelligent companion powered by Google Gemini AI for instant, smart responses'
    },
    {
      icon: Users,
      title: 'Expert Faculty',
      description: '19+ distinguished professors and researchers specializing in AI, ML, and emerging technologies'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: '27+ courses across 6 semesters covering cutting-edge AI/ML topics and practical applications'
    },
    {
      icon: Calendar,
      title: 'Academic Calendar',
      description: 'Stay updated with important dates, events, and examination schedules'
    },
    {
      icon: Building2,
      title: 'State-of-the-Art Labs',
      description: '4+ specialized labs with advanced equipment for AI/ML research and development'
    }
  ];

  const stats = [
    { label: 'Faculty Members', value: '19+', icon: Users },
    { label: 'Courses Available', value: '27+', icon: BookOpen },
    { label: 'Research Areas', value: '15+', icon: Lightbulb },
    { label: 'Specialized Labs', value: '4+', icon: Building2 }
  ];

  const researchAreas = [
    'Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing',
    'Artificial Intelligence', 'Data Analytics', 'Blockchain Technology', 'IoT',
    'Cloud Computing', 'Computer Networks', 'Algorithms', 'Ad-hoc Networks',
    'Data Mining', 'Neural Networks', 'Robotics'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-40 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ x: [0, -100, 0], y: [0, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with HOD */}
        <motion.section 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="flex justify-center mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BMSCELogo size="xl" variant="creative" className="text-center" />
          </motion.div>

          {/* HOD Section */}
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* HOD Image */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <img 
                    src="/assets/hod.png" 
                    alt="Dr. M Dakshayini - HOD" 
                    className="w-28 h-28 rounded-xl object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-28 h-28 rounded-xl bg-white/20 flex items-center justify-center">
                    <GraduationCap className="w-12 h-12 text-white" />
                  </div>
                </div>
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>

              {/* HOD Info */}
              <div className="text-left flex-1">
                <motion.h2 
                  className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Dr. M Dakshayini
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-700 font-semibold mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  Professor & Head of Department
                </motion.p>
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600">dakshayini.ise@bmsce.ac.in</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600">+91-80-26622130</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600">15+ years experience, 45+ publications</span>
                  </div>
                </motion.div>
              </div>
        </div>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              AIML Department
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-700 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Welcome to the <span className="font-bold text-purple-600">Department of Machine Learning</span> at BMSCE! 
            Established in 2020, we're a rapidly growing discipline focused on advancing education and research in Artificial Intelligence and Machine Learning.
          </motion.p>
        </motion.section>

        {/* Department Overview */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-12"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-12">
              <motion.h2 
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  Department Overview
                </span>
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Department Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <GraduationCap className="w-8 h-8 text-purple-600 mr-3" />
                  About Our Department
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    The Department of Machine Learning at B.M.S. College of Engineering, established in <span className="font-bold text-purple-600">2020</span>, 
                    is a rapidly growing discipline focused on advancing education and research in Artificial Intelligence and Machine Learning.
                  </p>
                  <p>
                    With an undergraduate intake of <span className="font-bold text-purple-600">360 students</span>, the department emphasizes cutting-edge areas such as:
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {['Deep Learning', 'Data Mining', 'Big Data', 'Natural Language Processing', 'Generative AI', 'Computer Vision'].map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                  <p>
                    Our faculty, a blend of experienced and innovative educators, excels in making complex concepts accessible and engaging, 
                    enriched by industry experience and interdisciplinary collaborations.
                  </p>
                </div>
              </motion.div>

              {/* B.S. Narayan Center */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Microscope className="w-8 h-8 text-purple-600 mr-3" />
                  B.S. Narayan Center of Excellence
                </h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    The <span className="font-bold text-purple-600">B.S. Narayan Center of Excellence (CoE) in AI & ML</span> manages research and development 
                    activities related to AI at the Department of Machine Learning, BMSCE.
                  </p>
                  <p>
                    It fosters dynamic industry-academic synergy for AI adoption, impactful projects with industry and government, 
                    facilitating the <span className="font-bold text-purple-600">NVIDIA DGX A100 server</span>.
                  </p>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mt-4">
                    <p className="text-sm font-medium text-gray-800">
                      The world's first purpose-built system for Deep Learning and accelerated analytics, delivering performance of 
                      <span className="font-bold text-purple-600"> 56 instances in parallel</span> without any deterioration of performance and computations.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Department Mission & Vision */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-12"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
        <div className="text-center mb-12">
              <motion.h2 
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  Our Mission & Vision
                </span>
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                We are dedicated to achieving excellent standards of quality education in the field of Artificial Intelligence and Machine Learning, 
                nurturing students with strong fundamentals for successful careers in AI/ML.
              </motion.p>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Vision</h3>
                <p className="text-gray-600">To achieve excellent standards of quality education in the field of Artificial Intelligence and Machine Learning.</p>
              </motion.div>
              <motion.div 
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mission 1</h3>
                <p className="text-gray-600">To nurture students with strong fundamentals for a successful career in AI & ML and motivate them for post-graduation and research.</p>
              </motion.div>
              <motion.div 
                className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Mission 2</h3>
                <p className="text-gray-600">To create impact in society with continuous research and innovations in AI & ML technologies.</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Research Areas */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-12"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-12">
              <motion.h2 
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                  Research Areas
                </span>
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-700 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Our faculty and students are actively engaged in cutting-edge research across multiple domains
              </motion.p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {researchAreas.map((area, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 text-center hover:from-purple-200 hover:to-blue-200 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="text-sm font-semibold text-gray-800">{area}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Key Features */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
        <div className="text-center mb-12">
            <motion.h2 
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                What Makes Us Special
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Discover the unique features that set our department apart
            </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
                <motion.div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
            );
          })}
        </div>
        </motion.section>

        {/* Department Stats */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white rounded-3xl shadow-2xl p-8"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
        <div className="text-center mb-12">
              <motion.h2 
                className="text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Department by Numbers
              </motion.h2>
              <motion.p 
                className="text-xl text-purple-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Impressive statistics that showcase our excellence
              </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <Icon className="w-10 h-10" />
                </div>
                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-purple-100 font-medium">{stat.label}</div>
                  </motion.div>
            );
          })}
        </div>
          </motion.div>
        </motion.section>

        {/* Technology Stack */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
        <div className="text-center mb-12">
            <motion.h2 
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Powered by Modern Tech
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Built with cutting-edge technologies for optimal performance and user experience
            </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'React', tech: 'Frontend', desc: 'React.js with TypeScript', icon: Code, color: 'from-blue-500 to-cyan-500' },
              { name: 'Node.js', tech: 'Backend', desc: 'Node.js with Express', icon: Database, color: 'from-green-500 to-emerald-500' },
              { name: 'Gemini AI', tech: 'AI Engine', desc: 'Google Gemini Integration', icon: Brain, color: 'from-purple-500 to-blue-500' },
              { name: 'JSON', tech: 'Data', desc: 'Comprehensive JSON Database', icon: Cpu, color: 'from-orange-500 to-red-500' }
            ].map((tech, index) => {
              const Icon = tech.icon;
              return (
                <motion.div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
            </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-600 font-medium mb-1">{tech.tech}</p>
                  <p className="text-xs text-gray-500">{tech.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

      {/* Contact Section */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Ready to Connect?
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Have questions about our department or want to explore AI/ML opportunities? We'd love to hear from you!
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="mailto:dakshayini.ise@bmsce.ac.in"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact HOD
              </motion.a>
              <motion.a
                href="/chat"
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Chat with LIAM
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.section>
        </div>
    </div>
  );
};

export default About;
