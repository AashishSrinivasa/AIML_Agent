import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  LogOut,
  Shield,
  Sparkles,
  Zap
} from 'lucide-react';
import AdminAuth from '../components/AdminAuth.tsx';

interface AdminData {
  faculty: any[];
  courses: any[];
  infrastructure: any;
  labs: any[];
  researchFacilities: any[];
}

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'faculty' | 'courses' | 'infrastructure' | 'labs' | 'research'>('faculty');
  const [data, setData] = useState<AdminData>({
    faculty: [],
    courses: [],
    infrastructure: {},
    labs: [],
    researchFacilities: []
  });
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [facultyRes, coursesRes, infrastructureRes] = await Promise.all([
        fetch('http://localhost:5001/api/faculty'),
        fetch('http://localhost:5001/api/courses'),
        fetch('http://localhost:5001/api/infrastructure')
      ]);

      const facultyData = await facultyRes.json();
      const coursesData = await coursesRes.json();
      const infrastructureData = await infrastructureRes.json();

      const infraData = infrastructureData.data?.[0] || {};
      setData({
        faculty: facultyData.data || [],
        courses: coursesData.data || [],
        infrastructure: infraData,
        labs: infraData.labs || [],
        researchFacilities: infraData.researchFacilities || []
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleLogin = (username: string, password: string): boolean => {
    // Simple authentication - in production, this should be more secure
    if (username === 'admin' && password === 'Aashish@15') {
      setIsAuthenticated(true);
      setShowAuth(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setData({ faculty: [], courses: [], infrastructure: {}, labs: [], researchFacilities: [] });
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleSave = async () => {
    // In a real application, this would make API calls to save the data
    console.log('Saving:', editingItem);
    setIsEditing(false);
    setEditingItem(null);
    // Reload data after saving
    loadData();
  };

  const handleDelete = async (id: string, type: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // In a real application, this would make API calls to delete the data
      console.log('Deleting:', id, type);
      // Reload data after deletion
      loadData();
    }
  };

  const handleAddNew = () => {
    const newItem = {
      id: `new_${Date.now()}`,
      name: '',
      // Add other default fields based on activeTab
    };
    setEditingItem(newItem);
    setIsEditing(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden flex items-center justify-center">
        {/* Enhanced Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{ 
              x: [0, 50, 0],
              y: [0, -100, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 4
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <Shield className="w-10 h-10 text-purple-600" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-purple-500/50"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Admin Panel
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
          >
            Access restricted to authorized personnel only
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg"
          >
            <Zap className="w-5 h-5 inline mr-2" />
            Login to Admin Panel
          </motion.button>
        </div>
        {showAuth && (
          <AdminAuth
            onLogin={handleLogin}
            onCancel={() => setShowAuth(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-2 h-2 text-white" />
                </motion.div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Admin Panel</h1>
                <p className="text-sm text-gray-600">Manage AIML Department Data</p>
              </div>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-purple-600 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{data.faculty.length}</div>
                <div className="text-gray-600">Faculty Members</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{data.courses.length}</div>
                <div className="text-gray-600">Courses</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{data.labs.length + data.researchFacilities.length}</div>
                <div className="text-gray-600">Infrastructure Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'faculty', label: 'Faculty', icon: Users },
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'labs', label: 'Labs', icon: Building2 },
                { id: 'research', label: 'Research Facilities', icon: Building2 }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                Manage {activeTab}
              </h2>
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Add New</span>
              </button>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'faculty' ? 'Designation' : activeTab === 'courses' ? 'Code' : 'Type'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {activeTab === 'faculty' ? 'Specialization' : activeTab === 'courses' ? 'Semester' : 'Location'}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    let currentData = [];
                    if (activeTab === 'faculty') currentData = data.faculty;
                    else if (activeTab === 'courses') currentData = data.courses;
                    else if (activeTab === 'labs') currentData = data.labs;
                    else if (activeTab === 'research') currentData = data.researchFacilities;
                    
                    return currentData.map((item: any, index: number) => (
                      <tr key={item.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name || item.title || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activeTab === 'faculty' ? item.designation : 
                           activeTab === 'courses' ? item.code : 
                           activeTab === 'labs' ? item.capacity :
                           activeTab === 'research' ? item.capacity :
                           'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activeTab === 'faculty' ? 
                            (Array.isArray(item.specialization) ? item.specialization.join(', ') : item.specialization) :
                           activeTab === 'courses' ? item.semester :
                           activeTab === 'labs' ? item.location :
                           activeTab === 'research' ? item.description?.substring(0, 50) + '...' :
                           'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, activeTab)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit {activeTab.slice(0, -1)}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editingItem.name || editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {activeTab === 'faculty' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={editingItem.designation || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, designation: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qualification
                    </label>
                    <input
                      type="text"
                      value={editingItem.qualification || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, qualification: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingItem.email || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={editingItem.phone || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Office
                    </label>
                    <input
                      type="text"
                      value={editingItem.office || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, office: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Office Hours
                    </label>
                    <input
                      type="text"
                      value={editingItem.officeHours || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, officeHours: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={editingItem.experience || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, experience: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publications
                    </label>
                    <input
                      type="number"
                      value={editingItem.publications || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, publications: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(editingItem.specialization) ? editingItem.specialization.join(', ') : editingItem.specialization || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, specialization: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Areas (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(editingItem.researchAreas) ? editingItem.researchAreas.join(', ') : editingItem.researchAreas || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, researchAreas: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'courses' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={editingItem.code || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, code: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credits
                    </label>
                    <input
                      type="number"
                      value={editingItem.credits || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, credits: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <input
                      type="text"
                      value={editingItem.semester || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, semester: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor
                    </label>
                    <input
                      type="text"
                      value={editingItem.instructor || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, instructor: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'labs' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={editingItem.capacity || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, capacity: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editingItem.location || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      value={editingItem.availability || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, availability: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'research' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={editingItem.capacity || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, capacity: parseInt(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Admin;
