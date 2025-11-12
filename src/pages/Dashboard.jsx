import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollment } from '../contexts/EnrollmentContext';
import { 
  FiBookOpen, 
  FiAward, 
  FiClock, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiBookmark,
  FiUser,
  FiMessageSquare
} from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { enrolledCourses, enrollInCourse } = useEnrollment();
  const [activeTab, setActiveTab] = useState('my-courses');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    learningHours: 0,
    certificates: 0
  });

  useEffect(() => {
    console.log('Dashboard - Enrolled courses:', enrolledCourses);
    
    // Calculate stats from enrolled courses
    const completedCount = enrolledCourses.filter(course => course.progress === 100).length;
    const totalHours = enrolledCourses.reduce((sum, course) => sum + (course.duration || 0), 0);
    const certificatesCount = enrolledCourses.filter(course => course.progress === 100).length;
    
    setStats({
      enrolledCourses: enrolledCourses.length,
      completedCourses: completedCount,
      learningHours: Math.round(totalHours),
      certificates: certificatesCount
    });
  }, [enrolledCourses]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-16">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-slate-800 p-4 flex justify-between items-center fixed top-16 left-0 right-0 z-30">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className={`fixed top-16 bottom-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0 w-64 bg-slate-800 transition-transform duration-200 ease-in-out z-20`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1">
              <button
                onClick={() => setActiveTab('my-courses')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'my-courses' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
              >
                <FiBookOpen className="mr-3 h-5 w-5" />
                My Courses
              </button>
              
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'wishlist' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
              >
                <FiBookmark className="mr-3 h-5 w-5" />
                Wishlist
              </button>
              
              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'messages' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
              >
                <FiMessageSquare className="mr-3 h-5 w-5" />
                Messages
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'profile' ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
              >
                <FiUser className="mr-3 h-5 w-5" />
                Profile Settings
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-slate-700 hover:text-red-400"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="pb-5 border-b border-slate-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">My Learning Dashboard</h1>
                  <p className="text-sm text-gray-400 mt-1">
                    {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''} enrolled
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link
                    to="/courses"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                  >
                    Browse Courses
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-slate-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500/20 rounded-md p-3">
                      <FiBookOpen className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Enrolled Courses</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-white">{stats.enrolledCourses}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500/20 rounded-md p-3">
                      <FiAward className="h-6 w-6 text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Completed</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-white">{stats.completedCourses}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500/20 rounded-md p-3">
                      <FiClock className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Learning Hours</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-white">{stats.learningHours}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500/20 rounded-md p-3">
                      <FiAward className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400 truncate">Certificates</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-white">{stats.certificates}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Courses */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">My Enrolled Courses</h2>
              
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-12 bg-slate-800 rounded-lg">
                  <FiBookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-white">No enrolled courses yet</h3>
                  <p className="mt-1 text-sm text-gray-400">Browse and enroll in courses to start learning</p>
                  <div className="mt-6">
                    <Link
                      to="/courses"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                    >
                      Browse Courses
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="bg-slate-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className="h-40 bg-slate-700 overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-white">{course.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {course.instructor?.name || course.instructorName || course.instructor || 'Instructor'}
                        </p>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{course.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${course.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-gray-400">
                            Last accessed: {course.lastAccessed ? new Date(course.lastAccessed).toLocaleDateString() : 'Recently'}
                          </span>
                          <button
                            onClick={() => navigate(`/learn/${course.id}/lecture/1`)}
                            className="text-sm font-medium text-primary hover:text-primary/80"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}\n                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
