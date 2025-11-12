import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCourses } from '../contexts/CoursesContext'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useEnrollment } from '../contexts/EnrollmentContext'
import { FiStar, FiClock, FiUsers, FiPlay, FiChevronDown, FiChevronUp, FiCheck, FiShoppingCart, FiHeart, FiShare2, FiAward, FiBarChart2, FiGlobe, FiFileText } from 'react-icons/fi'

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCourseById } = useCourses()
  const { isAuthenticated } = useAuth()
  const { addToCart, isInCart } = useCart()
  const { enrollInCourse, isEnrolled } = useEnrollment()
  
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('curriculum')
  const [expandedSections, setExpandedSections] = useState({})
  const [wishlisted, setWishlisted] = useState(false)
  
  const enrolled = isEnrolled(id)
  
  // Mock course data - in a real app, this would come from an API
  const mockCourse = {
    id: '1',
    title: 'The Complete Web Development Bootcamp',
    subtitle: 'Go from zero to hero in web development with this comprehensive course',
    description: 'This is a comprehensive course that will take you from zero to hero in web development. You will learn HTML, CSS, JavaScript, React, Node.js, and more. By the end of this course, you will be able to build full-stack web applications from scratch.',
    instructor: {
      id: '1',
      name: 'John Doe',
      title: 'Senior Web Developer',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      bio: 'John has over 10 years of experience in web development. He has worked with companies like Google, Facebook, and Amazon. He is passionate about teaching and helping others learn to code.',
      rating: 4.8,
      reviews: 1245,
      students: 50000,
      courses: 12
    },
    thumbnail: 'https://via.placeholder.com/800x450',
    previewVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    price: 99.99,
    originalPrice: 199.99,
    discount: 50,
    rating: 4.7,
    reviews: 1245,
    students: 50000,
    duration: '35h 20m',
    lectures: 320,
    level: 'Beginner',
    category: 'Web Development',
    language: 'English',
    lastUpdated: '2023-10-15',
    requirements: [
      'Basic computer skills',
      'No prior programming experience needed',
      'A computer with internet access'
    ],
    learningOutcomes: [
      'Build 16 web development projects for your portfolio',
      'Create fully functional websites and web apps',
      'Master frontend development with React',
      'Build backend servers and APIs with Node.js and Express',
      'Work with databases like MongoDB and SQL',
      'Deploy your applications to the web'
    ],
    curriculum: [
      {
        id: 'section-1',
        title: 'Getting Started',
        lectures: 5,
        duration: '45m',
        items: [
          { id: 'lecture-1', title: 'Welcome to the Course', type: 'video', duration: '5:30', preview: true },
          { id: 'lecture-2', title: 'Course Overview', type: 'video', duration: '10:15', preview: false },
          { id: 'lecture-3', title: 'Setting Up Your Environment', type: 'video', duration: '12:45', preview: true },
          { id: 'lecture-4', title: 'Introduction to Web Development', type: 'video', duration: '8:20', preview: true },
          { id: 'lecture-5', title: 'Course Resources', type: 'article', duration: '8:10', preview: false }
        ]
      },
      {
        id: 'section-2',
        title: 'HTML Fundamentals',
        lectures: 8,
        duration: '2h 15m',
        items: [
          { id: 'lecture-6', title: 'Introduction to HTML', type: 'video', duration: '15:30', preview: true },
          { id: 'lecture-7', title: 'HTML Document Structure', type: 'video', duration: '12:45', preview: false },
          { id: 'lecture-8', title: 'Working with Text', type: 'video', duration: '18:20', preview: false },
          { id: 'lecture-9', title: 'Links and Images', type: 'video', duration: '14:10', preview: true },
          { id: 'lecture-10', title: 'HTML Forms', type: 'video', duration: '22:30', preview: false },
          { id: 'lecture-11', title: 'HTML5 Semantic Elements', type: 'video', duration: '16:45', preview: false },
          { id: 'lecture-12', title: 'HTML Tables', type: 'video', duration: '12:20', preview: false },
          { id: 'lecture-13', title: 'HTML Project', type: 'video', duration: '23:00', preview: false }
        ]
      },
      // More sections would be added here
    ]
  }

  useEffect(() => {
    // In a real app, you would fetch the course data from an API
    const fetchCourse = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Try to get course from CoursesContext first
        const courseFromContext = getCourseById(id);
        
        if (courseFromContext) {
          // Use course from context and add curriculum structure
          setCourse({
            ...courseFromContext,
            curriculum: mockCourse.curriculum // Use mock curriculum for now
          })
        } else {
          // Fallback to mock course with correct ID
          setCourse({
            ...mockCourse,
            id: id
          })
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching course:', error)
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id, getCourseById])

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Handle enrollment
  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }
    
    if (course) {
      console.log('Attempting to enroll in course:', course);
      const success = enrollInCourse(course)
      console.log('Enrollment success:', success);
      
      // Give a small delay to ensure localStorage is updated
      setTimeout(() => {
        if (success || enrolled) {
          // Redirect to the first lecture
          navigate(`/learn/${id}/lecture/${course.curriculum[0].items[0].id}`)
        } else {
          console.log('Already enrolled, redirecting to course player');
          navigate(`/learn/${id}/lecture/${course.curriculum[0].items[0].id}`)
        }
      }, 100);
    } else {
      console.error('Course data not available for enrollment');
    }
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }
    
    if (!isInCart(id)) {
      addToCart({
        id: course.id,
        title: course.title,
        price: course.price,
        thumbnail: course.thumbnail,
        instructor: course.instructor.name
      })
    } else {
      navigate('/cart')
    }
  }

  // Handle wishlist toggle
  const toggleWishlist = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } })
      return
    }
    
    setWishlisted(!wishlisted)
    // In a real app, you would call an API to update the wishlist
  }

  // Format price with 2 decimal places
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2 mb-8"></div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3">
                <div className="aspect-video bg-slate-800 rounded-lg mb-6"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-full"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <div className="bg-slate-800 rounded-lg p-6 space-y-4">
                  <div className="h-8 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-12 bg-slate-700 rounded"></div>
                  <div className="h-10 bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course not found</h1>
          <p className="text-gray-400 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/courses" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-12">
      {/* Course Header */}
      <div className="bg-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between">
            <div className="lg:w-2/3">
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
                  </li>
                  <li>
                    <span className="text-gray-500">/</span>
                  </li>
                  <li>
                    <Link to="/courses" className="text-gray-400 hover:text-white">Courses</Link>
                  </li>
                  <li>
                    <span className="text-gray-500">/</span>
                  </li>
                  <li className="text-primary">
                    {course.title}
                  </li>
                </ol>
              </nav>
              
              <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-4">{course.subtitle}</p>
              
              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">{course.rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar 
                        key={star} 
                        className={`h-4 w-4 ${star <= Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-1">({course.reviews.toLocaleString()})</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <FiUsers className="mr-1" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>Last updated {course.lastUpdated}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img 
                    src={course.instructor.avatar} 
                    alt={course.instructor.name} 
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="ml-2 text-sm text-gray-300">{course.instructor.name}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 lg:w-1/3 lg:pl-8">
              <div className="bg-slate-700 rounded-lg overflow-hidden shadow-lg">
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <button className="bg-white bg-opacity-90 rounded-full p-3 text-primary hover:bg-opacity-100 transition">
                      <FiPlay className="h-6 w-6" />
                    </button>
                  </div>
                  {course.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {course.discount}% OFF
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-baseline mb-4">
                    {course.originalPrice > course.price ? (
                      <>
                        <span className="text-3xl font-bold text-white">
                          {formatPrice(course.price)}
                        </span>
                        <span className="ml-2 text-lg text-gray-400 line-through">
                          {formatPrice(course.originalPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {course.price > 0 ? formatPrice(course.price) : 'Free'}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {enrolled ? (
                      <Link
                        to={`/learn/${id}/lecture/${course.curriculum[0].items[0].id}`}
                        className="block w-full text-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={handleEnroll}
                          className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                        >
                          Enroll Now
                        </button>
                        <button
                          onClick={handleAddToCart}
                          className="w-full flex justify-center items-center px-4 py-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-slate-600"
                        >
                          <FiShoppingCart className="mr-2 h-4 w-4" />
                          {isInCart(id) ? 'Go to Cart' : 'Add to Cart'}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={toggleWishlist}
                      className={`w-full flex justify-center items-center px-4 py-3 border ${
                        wishlisted ? 'border-primary text-primary' : 'border-gray-600 text-white'
                      } rounded-md shadow-sm text-sm font-medium hover:bg-slate-700`}
                    >
                      <FiHeart className={`mr-2 h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
                      {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                    </button>
                    
                    <button className="w-full flex justify-center items-center px-4 py-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-slate-700">
                      <FiShare2 className="mr-2 h-4 w-4" />
                      Share
                    </button>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">30-Day Money-Back Guarantee</p>
                    <p className="mt-2 text-sm text-gray-300">Full Lifetime Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="border-b border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {['Overview', 'Curriculum', 'Instructor', 'Reviews', 'FAQs'].map((tab) => {
                  const tabId = tab.toLowerCase()
                  return (
                    <button
                      key={tabId}
                      onClick={() => setActiveTab(tabId)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tabId
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                })}
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">About This Course</h2>
                  <p className="text-gray-300 mb-6">{course.description}</p>
                  
                  <h3 className="text-xl font-semibold text-white mt-8 mb-4">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start">
                        <FiCheck className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-300">{outcome}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mt-8 mb-4">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-8">
                    {course.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-semibold text-white mt-8 mb-4">Course Curriculum</h3>
                  <div className="bg-slate-800 rounded-lg overflow-hidden mb-8">
                    {course.curriculum.slice(0, 3).map((section, sectionIndex) => (
                      <div key={section.id} className="border-b border-gray-700 last:border-b-0">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-700 focus:outline-none"
                        >
                          <div>
                            <h4 className="font-medium text-white">{section.title}</h4>
                            <div className="flex items-center mt-1 text-sm text-gray-400">
                              <span>{section.lectures} lectures</span>
                              <span className="mx-2">•</span>
                              <span>{section.duration}</span>
                            </div>
                          </div>
                          {expandedSections[section.id] ? (
                            <FiChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FiChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        
                        {expandedSections[section.id] && (
                          <div className="bg-slate-900 px-6 py-2">
                            <ul className="divide-y divide-gray-800">
                              {section.items.map((item) => (
                                <li key={item.id} className="py-3">
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-slate-800 rounded-full mr-3">
                                      {item.type === 'video' ? (
                                        <FiPlay className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <FiFileText className="h-4 w-4 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white truncate">
                                        {item.title}
                                      </p>
                                      <div className="flex items-center text-xs text-gray-400 mt-1">
                                        <span>{item.duration}</span>
                                        {item.preview && (
                                          <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                            Preview
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="px-6 py-4 text-center">
                      <button
                        onClick={() => setActiveTab('curriculum')}
                        className="text-primary hover:underline text-sm font-medium"
                      >
                        Show all {course.curriculum.length} sections • {course.lectures} lectures • {course.duration} total length
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'curriculum' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Course Content</h2>
                    <div className="text-sm text-gray-400">
                      {course.curriculum.length} sections • {course.lectures} lectures • {course.duration} total length
                    </div>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg overflow-hidden">
                    {course.curriculum.map((section, sectionIndex) => (
                      <div key={section.id} className="border-b border-gray-700 last:border-b-0">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-slate-700 focus:outline-none"
                        >
                          <div>
                            <h4 className="font-medium text-white">{sectionIndex + 1}. {section.title}</h4>
                            <div className="flex items-center mt-1 text-sm text-gray-400">
                              <span>{section.lectures} lectures</span>
                              <span className="mx-2">•</span>
                              <span>{section.duration}</span>
                            </div>
                          </div>
                          {expandedSections[section.id] ? (
                            <FiChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FiChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        
                        {expandedSections[section.id] && (
                          <div className="bg-slate-900 px-6">
                            <ul className="divide-y divide-gray-800">
                              {section.items.map((item, itemIndex) => (
                                <li key={item.id} className="py-3">
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-slate-800 rounded-full mr-3">
                                      {item.type === 'video' ? (
                                        <FiPlay className="h-4 w-4 text-gray-400" />
                                      ) : (
                                        <FiFileText className="h-4 w-4 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white">
                                        {sectionIndex + 1}.{itemIndex + 1} {item.title}
                                      </p>
                                      <div className="flex items-center text-xs text-gray-400 mt-1">
                                        <span>{item.duration}</span>
                                        {item.preview && !enrolled && (
                                          <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                                            Preview
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    {enrolled || item.preview ? (
                                      <button className="ml-2 text-primary hover:underline text-sm font-medium">
                                        {item.preview && !enrolled ? 'Preview' : 'Start'}
                                      </button>
                                    ) : (
                                      <span className="ml-2 text-xs text-gray-500">
                                        <FiLock className="h-3.5 w-3.5 inline mr-1" />
                                      </span>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'instructor' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">About the Instructor</h2>
                  
                  <div className="bg-slate-800 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 mb-6 md:mb-0">
                        <img 
                          src={course.instructor.avatar} 
                          alt={course.instructor.name} 
                          className="h-32 w-32 rounded-full mx-auto md:mx-0"
                        />
                      </div>
                      <div className="md:w-3/4 md:pl-8">
                        <h3 className="text-xl font-bold text-white">{course.instructor.name}</h3>
                        <p className="text-gray-300 mb-4">{course.instructor.title}</p>
                        
                        <div className="flex items-center space-x-6 mb-6">
                          <div className="flex items-center">
                            <FiStar className="h-5 w-5 text-yellow-400 mr-1" />
                            <span className="text-gray-300">
                              {course.instructor.rating} Instructor Rating
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiAward className="h-5 w-5 text-blue-400 mr-1" />
                            <span className="text-gray-300">
                              {course.instructor.reviews.toLocaleString()} Reviews
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiUsers className="h-5 w-5 text-green-400 mr-1" />
                            <span className="text-gray-300">
                              {course.instructor.students.toLocaleString()} Students
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FiPlay className="h-5 w-5 text-purple-400 mr-1" />
                            <span className="text-gray-300">
                              {course.instructor.courses} Courses
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-6">{course.instructor.bio}</p>
                        
                        <div className="flex space-x-4">
                          <button className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-slate-700">
                            Follow
                          </button>
                          <button className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-slate-700">
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Student Feedback</h2>
                    <div className="flex items-center">
                      <div className="text-5xl font-bold text-white mr-4">{course.rating}</div>
                      <div>
                        <div className="flex items-center mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar 
                              key={star} 
                              className={`h-5 w-5 ${star <= Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-400">
                          Course Rating • {course.reviews.toLocaleString()} ratings
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">How are ratings calculated?</h3>
                    <p className="text-gray-300 mb-4">
                      To calculate the overall star rating and percentage breakdown, we don't use a simple average. 
                      Instead, our system considers things like how recent the review is and if the reviewer bought 
                      the item on Udemy. It also analyzes reviews to verify trustworthiness.
                    </p>
                    <button className="text-primary hover:underline text-sm font-medium">
                      Learn more about reviews
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    {[1, 2, 3].map((review) => (
                      <div key={review} className="border-b border-gray-700 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <img 
                            src={`https://randomuser.me/api/portraits/${review % 2 === 0 ? 'women' : 'men'}/${review + 5}.jpg`} 
                            alt="Reviewer" 
                            className="h-12 w-12 rounded-full mr-4"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-white">
                                  {review === 1 ? 'Sarah Johnson' : review === 2 ? 'Michael Chen' : 'Emily Rodriguez'}
                                </h4>
                                <div className="flex items-center mt-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar 
                                      key={star} 
                                      className={`h-4 w-4 ${star <= 5 - (review - 1) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-400">
                                    {5 - (review - 1)}.0
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-400">
                                {review === 1 ? '2 weeks ago' : review === 2 ? '1 month ago' : '2 months ago'}
                              </span>
                            </div>
                            <h5 className="font-medium text-white mt-2">
                              {review === 1 
                                ? 'Amazing course with great content!' 
                                : review === 2 
                                  ? 'Very informative and well-structured' 
                                  : 'Excellent for beginners'}
                            </h5>
                            <p className="text-gray-300 mt-2">
                              {review === 1 
                                ? 'I learned so much from this course. The instructor explains complex topics in a very understandable way. The projects were challenging but doable, and I feel much more confident in my skills now.' 
                                : review === 2 
                                  ? 'The course covers a wide range of topics and provides a solid foundation. The instructor is knowledgeable and responsive to questions. The only reason I\'m not giving 5 stars is that some sections could use more detailed explanations.' 
                                  : 'As someone who was completely new to web development, this course was perfect for me. The pace was just right, and the instructor does a great job of breaking down concepts. Highly recommended!'}
                            </p>
                            <div className="flex items-center mt-4 text-sm text-gray-400">
                              <button className="flex items-center mr-6 hover:text-white">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                <span>Helpful ({Math.floor(Math.random() * 50)})</span>
                              </button>
                              <button className="flex items-center hover:text-white">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Comment</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center mt-8">
                      <button className="px-6 py-2 border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-slate-700">
                        Show More Reviews
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'faqs' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        question: 'What will I be able to do after this course?',
                        answer: 'After completing this course, you will have a solid understanding of web development fundamentals and be able to build responsive websites and web applications. You\'ll be proficient in HTML, CSS, JavaScript, and have experience with modern frameworks like React and Node.js.'
                      },
                      {
                        question: 'How long do I have access to the course?',
                        answer: 'You will have lifetime access to the course materials, including any future updates. This means you can learn at your own pace and revisit the content whenever you need a refresher.'
                      },
                      {
                        question: 'Is there a certificate of completion?',
                        answer: 'Yes, upon completing all the course content and passing the final assessment, you will receive a certificate of completion that you can add to your resume or LinkedIn profile.'
                      },
                      {
                        question: 'What if I need help during the course?',
                        answer: 'You can ask questions in the Q&A section, and the instructor or teaching assistants will respond to your queries. Many students also find it helpful to discuss concepts with their peers in the course community.'
                      },
                      {
                        question: 'Can I get a refund if I\'m not satisfied?',
                        answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with the course for any reason, you can request a full refund within 30 days of purchase.'
                      }
                    ].map((faq, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(`faq-${index}`)}
                          className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center hover:bg-slate-800"
                        >
                          <h3 className="font-medium text-white">{faq.question}</h3>
                          {expandedSections[`faq-${index}`] ? (
                            <FiChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <FiChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        
                        {expandedSections[`faq-${index}`] && (
                          <div className="px-6 pb-4 pt-0 text-gray-300 bg-slate-800">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="mt-8 text-center">
                      <p className="text-gray-400 mb-4">Still have questions?</p>
                      <button className="px-6 py-2 border border-primary rounded-md text-sm font-medium text-primary hover:bg-primary/10">
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-slate-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">This course includes:</h3>
              
              <ul className="space-y-3 mb-6">
                {[
                  { icon: <FiPlay className="h-5 w-5 text-green-400" />, text: `${course.duration} on-demand video` },
                  { icon: <FiFileText className="h-5 w-5 text-blue-400" />, text: `${course.lectures} articles` },
                  { icon: <FiDownload className="h-5 w-5 text-yellow-400" />, text: '10 downloadable resources' },
                  { icon: <FiAward className="h-5 w-5 text-purple-400" />, text: 'Certificate of completion' },
                  { icon: <FiSmartphone className="h-5 w-5 text-red-400" />, text: 'Access on mobile and TV' },
                  { icon: <FiGlobe className="h-5 w-5 text-indigo-400" />, text: 'Full lifetime access' },
                  { icon: <FiBarChart2 className="h-5 w-5 text-pink-400" />, text: 'Assignments' },
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 mt-0.5">{item.icon}</span>
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>
              
              <div className="space-y-4">
                <h4 className="font-medium text-white">Share this course</h4>
                <div className="flex space-x-3">
                  {['Facebook', 'Twitter', 'LinkedIn', 'Email'].map((social) => (
                    <button
                      key={social}
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white"
                      aria-label={`Share on ${social}`}
                    >
                      {social === 'Facebook' && <FiFacebook className="h-5 w-5" />}
                      {social === 'Twitter' && <FiTwitter className="h-5 w-5" />}
                      {social === 'LinkedIn' && <FiLinkedin className="h-5 w-5" />}
                      {social === 'Email' && <FiMail className="h-5 w-5" />}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className="font-medium text-white mb-3">Training 5 or more people?</h4>
                <p className="text-sm text-gray-300 mb-4">
                  Get your team access to 5,000+ top courses, anytime, anywhere with Udemy for Business.
                </p>
                <button className="w-full text-center text-sm font-medium text-primary hover:underline">
                  Get Udemy for Business
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
