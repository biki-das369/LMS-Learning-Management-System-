import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/api'

const CoursesContext = createContext()

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    price: '',
  })

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        // In a real app, you would fetch from your API
        // const response = await api.get('/courses')
        // setCourses(response.data)
        
        // Enhanced mock data with diverse courses
        const mockCourses = [
          // Web Development
          {
            id: 'web1',
            title: 'React - The Complete Guide 2024',
            description: 'Dive in and learn React from scratch! Learn React, Hooks, Redux, React Router, Next.js and way more!',
            instructor: { id: 'inst1', name: 'Maximilian Schwarzmüller' },
            price: 129.99,
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/1362070_b9a1_2.jpg',
            category: 'Web Development',
            level: 'All Levels',
            rating: 4.7,
            students: 345621,
            duration: '52.5 hours',
            lectures: [
              { id: 'web1-1', title: 'Getting Started with React', duration: '18:45' },
              { id: 'web1-2', title: 'Components, Props & JSX', duration: '24:30' },
              { id: 'web1-3', title: 'State & Events', duration: '21:15' },
              { id: 'web1-4', title: 'Hooks in Depth', duration: '35:20' },
              { id: 'web1-5', title: 'Building a Complete Project', duration: '1:45:30' }
            ],
          },
          {
            id: 'web2',
            title: 'The Complete JavaScript Course 2024',
            description: 'The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory.',
            instructor: { id: 'inst2', name: 'Jonas Schmedtmann' },
            price: 94.99,
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/851712_fc61_6.jpg',
            category: 'Web Development',
            level: 'Beginner',
            rating: 4.7,
            students: 512378,
            duration: '69 hours',
            lectures: [
              { id: 'web2-1', title: 'JavaScript Fundamentals', duration: '45:20' },
              { id: 'web2-2', title: 'DOM Manipulation', duration: '32:15' },
              { id: 'web2-3', title: 'Advanced JavaScript', duration: '1:15:40' },
              { id: 'web2-4', title: 'Modern JavaScript Features', duration: '28:50' }
            ],
          },
          
          // Data Science
          {
            id: 'ds1',
            title: 'Python for Data Science and Machine Learning',
            description: 'Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, and more!',
            instructor: { id: 'inst3', name: 'Jose Portilla' },
            price: 129.99,
            thumbnail: 'https://educationnest.com/wp-content/uploads/2023/04/data-science-with-python-training-course-1.png',
            category: 'Data Science',
            level: 'Intermediate',
            rating: 4.6,
            students: 287453,
            duration: '44 hours',
            lectures: [
              { id: 'ds1-1', title: 'Python Crash Course', duration: '2:15:30' },
              { id: 'ds1-2', title: 'NumPy for Data Analysis', duration: '3:20:15' },
              { id: 'ds1-3', title: 'Pandas for Data Manipulation', duration: '4:10:45' },
              { id: 'ds1-4', title: 'Data Visualization', duration: '3:45:20' },
              { id: 'ds1-5', title: 'Machine Learning with Scikit-Learn', duration: '6:30:10' }
            ],
          },
          
          // Business
          {
            id: 'biz1',
            title: 'The Complete Financial Analyst Course 2024',
            description: 'Excel, Accounting, Financial Statement Analysis, Business Analysis, Financial Math, PowerPoint: Everything is Included!',
            instructor: { id: 'inst4', name: '365 Careers' },
            price: 149.99,
            thumbnail: 'https://console.northstaracad.com/uploads/blogs/CFA%20Chartered%20Financial%20Analyst%20Course,%20A%20Comprehensive%20Guide%20on%20CFA%20Course.jpg',
            category: 'Business',
            level: 'Beginner',
            rating: 4.6,
            students: 178923,
            duration: '34.5 hours',
            lectures: [
              { id: 'biz1-1', title: 'Introduction to Financial Analysis', duration: '1:15:20' },
              { id: 'biz1-2', title: 'Excel for Financial Analysis', duration: '4:30:15' },
              { id: 'biz1-3', title: 'Financial Statement Analysis', duration: '5:20:40' },
              { id: 'biz1-4', title: 'Business Valuation', duration: '3:45:10' }
            ],
          },
          
          // Design
          {
            id: 'design1',
            title: 'UI/UX Design Bootcamp',
            description: 'Become a Designer in 2024! Master Mobile and Web Design, User Interface + User Experience (UI/UX Design), HTML, and CSS',
            instructor: { id: 'inst5', name: 'Daniel Walter Scott' },
            price: 89.99,
            thumbnail: 'https://www.jdinstitute.edu.in/media/2024/07/UIUX-Design-Course-How-to-become-a-UIUX-designer-in-India-3-scaled.webp',
            category: 'Design',
            level: 'Beginner',
            rating: 4.7,
            students: 215678,
            duration: '38 hours',
            lectures: [
              { id: 'design1-1', title: 'Introduction to UI/UX Design', duration: '1:30:15' },
              { id: 'design1-2', title: 'Figma Fundamentals', duration: '3:15:40' },
              { id: 'design1-3', title: 'Mobile App Design', duration: '4:20:25' },
              { id: 'design1-4', title: 'Web Design Principles', duration: '3:45:10' },
              { id: 'design1-5', title: 'Design Systems', duration: '2:50:30' }
            ],
          },
          
          // Marketing
          {
            id: 'mkt1',
            title: 'The Complete Digital Marketing Course',
            description: 'Master Digital Marketing: Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!',
            instructor: { id: 'inst6', name: 'Rob Percival' },
            price: 109.99,
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/914296_3670_8.jpg',
            category: 'Marketing',
            level: 'All Levels',
            rating: 4.5,
            students: 432156,
            duration: '23.5 hours',
            lectures: [
              { id: 'mkt1-1', title: 'Digital Marketing Fundamentals', duration: '2:15:20' },
              { id: 'mkt1-2', title: 'SEO & Content Marketing', duration: '3:45:15' },
              { id: 'mkt1-3', title: 'Social Media Marketing', duration: '4:10:40' },
              { id: 'mkt1-4', title: 'Email Marketing & Automation', duration: '2:55:25' },
              { id: 'mkt1-5', title: 'Google Analytics & Ads', duration: '3:25:15' }
            ],
          },
          
          // Personal Development
          {
            id: 'pd1',
            title: 'Ultimate Personal Development Course',
            description: 'Personal Development Masterclass - Improve Your Mental & Emotional Health, Build Better Habits, Overcome Obstacles & More!',
            instructor: { id: 'inst7', name: 'TJ Walker' },
            price: 79.99,
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/396876_4a7d_2.jpg',
            category: 'Personal Development',
            level: 'All Levels',
            rating: 4.6,
            students: 189234,
            duration: '28 hours',
            lectures: [
              { id: 'pd1-1', title: 'Building Better Habits', duration: '2:45:30' },
              { id: 'pd1-2', title: 'Time Management Mastery', duration: '3:15:20' },
              { id: 'pd1-3', title: 'Emotional Intelligence', duration: '2:50:15' },
              { id: 'pd1-4', title: 'Goal Setting & Achievement', duration: '3:10:45' },
              { id: 'pd1-5', title: 'Overcoming Procrastination', duration: '2:25:30' }
            ],
          },
          
          // Photography
          {
            id: 'photo1',
            title: 'Photography Masterclass: A Complete Guide to Photography',
            description: 'The Best Online Professional Photography Class: How to Take Amazing Photos for Beginners & Advanced Photographers',
            instructor: { id: 'inst8', name: 'Phil Ebiner' },
            price: 94.99,
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/5131956_4a0b_3.jpg',
            category: 'Photography',
            level: 'All Levels',
            rating: 4.7,
            students: 321456,
            duration: '31.5 hours',
            lectures: [
              { id: 'photo1-1', title: 'Camera Basics', duration: '3:15:20' },
              { id: 'photo1-2', title: 'Mastering Light', duration: '4:25:15' },
              { id: 'photo1-3', title: 'Composition Techniques', duration: '3:45:30' },
              { id: 'photo1-4', title: 'Portrait Photography', duration: '4:10:45' },
              { id: 'photo1-5', title: 'Landscape Photography', duration: '3:55:20' }
            ],
          },
          
          // Music
          {
            id: 'music1',
            title: 'Complete Guitar Lessons System',
            description: 'Beginner to Advanced Guitar Lessons - Fingerstyle, Guitar Chords, Guitar Theory, Guitar Techniques, and More!',
            instructor: { id: 'inst9', name: 'Erich Andreas' },
            price: 119.99,
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/351090_1b3f_3.jpg',
            category: 'Music',
            level: 'Beginner',
            rating: 4.7,
            students: 267891,
            duration: '42 hours',
            lectures: [
              { id: 'music1-1', title: 'Guitar Basics', duration: '2:30:15' },
              { id: 'music1-2', title: 'Essential Chords', duration: '3:45:30' },
              { id: 'music1-3', title: 'Strumming Patterns', duration: '3:15:20' },
              { id: 'music1-4', title: 'Music Theory for Guitar', duration: '4:20:15' },
              { id: 'music1-5', title: 'Playing Your First Song', duration: '2:55:40' }
            ],
          },
          
          // Health & Fitness
          {
            id: 'health1',
            title: 'Complete Fitness Trainer Certification: Beginner to Advanced',
            description: 'Become a Personal Trainer. Get certified & build muscle, burn fat, and get in the best shape of your life!',
            instructor: { id: 'inst10', name: 'Felix Harder' },
            price: 109.99,
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/1659676_9aeb_2.jpg',
            category: 'Health & Fitness',
            level: 'All Levels',
            rating: 4.6,
            students: 198765,
            duration: '36.5 hours',
            lectures: [
              { id: 'health1-1', title: 'Fitness Fundamentals', duration: '2:45:20' },
              { id: 'health1-2', title: 'Workout Programming', duration: '4:15:30' },
              { id: 'health1-3', title: 'Nutrition & Diet', duration: '3:50:15' },
              { id: 'health1-4', title: 'Injury Prevention', duration: '3:25:40' },
              { id: 'health1-5', title: 'Client Assessment', duration: '3:10:25' }
            ],
          },
          
          // IT & Software
          {
            id: 'it1',
            title: 'AWS Certified Cloud Practitioner 2024',
            description: 'Full Practice Exam with Explanations included! AWS Certified Cloud Practitioner CLF-C02 500+ unique questions',
            instructor: { id: 'inst11', name: 'Stephane Maarek' },
            price: 129.99,
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/2196488_8fc7_10.jpg',
            category: 'IT & Software',
            level: 'Beginner',
            rating: 4.7,
            students: 245678,
            duration: '28.5 hours',
            lectures: [
              { id: 'it1-1', title: 'Cloud Concepts', duration: '3:15:30' },
              { id: 'it1-2', title: 'AWS Global Infrastructure', duration: '4:20:15' },
              { id: 'it1-3', title: 'AWS Core Services', duration: '5:10:45' },
              { id: 'it1-4', title: 'Security & Compliance', duration: '4:35:20' },
              { id: 'it1-5', title: 'Pricing & Support', duration: '3:45:15' }
            ],
          },
          
          // Language
          {
            id: 'lang1',
            title: 'Complete Spanish Course: Learn Spanish for Beginners',
            description: 'Learn Spanish with the complete, non-stop SPEAKING method - in a matter of weeks, not years!',
            instructor: { id: 'inst12', name: 'Linguae Learning' },
            price: 89.99,
            thumbnail: 'https://img-c.udemycdn.com/course/240x135/2463496_0e5e_4.jpg',
            category: 'Language',
            level: 'Beginner',
            rating: 4.6,
            students: 312456,
            duration: '47.5 hours',
            lectures: [
              { id: 'lang1-1', title: 'Basic Greetings', duration: '2:15:30' },
              { id: 'lang1-2', title: 'Essential Vocabulary', duration: '3:45:15' },
              { id: 'lang1-3', title: 'Grammar Foundations', duration: '4:20:40' },
              { id: 'lang1-4', title: 'Conversation Practice', duration: '5:10:25' },
              { id: 'lang1-5', title: 'Cultural Insights', duration: '3:25:15' }
            ],
          }
        ]
        
        setCourses(mockCourses)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching courses:', err)
        setError('Failed to load courses. Please try again later.')
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !filters.category || course.category === filters.category
    const matchesLevel = !filters.level || course.level === filters.level
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const getCourseById = (id) => {
    return courses.find(course => course.id === id)
  }

  const addCourse = (course) => {
    // In a real app, you would make an API call to add the course
    const newCourse = {
      ...course,
      id: Date.now().toString(),
      students: 0,
      rating: 0,
      lectures: [],
    }
    setCourses(prev => [...prev, newCourse])
    return newCourse
  }

  const updateCourse = (id, updates) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === id ? { ...course, ...updates } : course
      )
    )
  }

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(course => course.id !== id))
  }

  const value = {
    courses: filteredCourses,
    allCourses: courses,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
  }

  return (
    <CoursesContext.Provider value={value}>
      {children}
    </CoursesContext.Provider>
  )
}

export const useCourses = () => {
  const context = useContext(CoursesContext)
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider')
  }
  return context
}
