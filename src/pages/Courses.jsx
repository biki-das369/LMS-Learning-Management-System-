import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useCourses } from '../contexts/CoursesContext'
import CourseCard from '../components/course/CourseCard'
import { FiFilter, FiSearch, FiX, FiChevronDown, FiChevronUp, FiStar, FiClock } from 'react-icons/fi'

const Courses = () => {
  const { courses, loading, setSearchTerm } = useCourses()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    price: searchParams.get('price') || '',
    rating: searchParams.get('rating') || '',
    search: searchParams.get('search') || '',
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular')
  
  // Extract unique categories and levels for filters
  const categories = ['All', ...new Set(courses.map(course => course.category).filter(Boolean))]
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const ratings = [4.5, 4.0, 3.5, 3.0]
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    
    if (sortBy) params.set('sort', sortBy)
    
    setSearchParams(params, { replace: true })
    
    // Update search term in context for global search
    if (filters.search !== undefined) {
      setSearchTerm(filters.search)
    }
  }, [filters, sortBy, setSearchParams, setSearchTerm])

  // Apply filters to courses
  const filteredCourses = courses.filter(course => {
    return (
      (filters.category === 'All' || !filters.category || course.category === filters.category) &&
      (filters.level === 'All' || !filters.level || course.level === filters.level) &&
      (!filters.rating || (course.rating >= parseFloat(filters.rating))) &&
      (!filters.price || 
        (filters.price === 'free' && course.price === 0) ||
        (filters.price === 'paid' && course.price > 0) ||
        (filters.price === 'under50' && course.price > 0 && course.price < 50) ||
        (filters.price === '50to100' && course.price >= 50 && course.price <= 100) ||
        (filters.price === 'over100' && course.price > 100)
      )
    )
  })

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch(sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'rating':
        return b.rating - a.rating
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'popular':
      default:
        return b.students - a.students
    }
  })

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'All' ? '' : value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      level: '',
      price: '',
      rating: '',
      search: '',
    })
    setSortBy('popular')
  }

  const isFilterActive = Object.values(filters).some(Boolean) || sortBy !== 'popular'

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Find the right course for you</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Browse through our extensive collection of courses and start learning today.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-slate-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center px-4 py-2 border border-gray-700 rounded-md bg-slate-800 text-gray-300 hover:bg-slate-700"
              >
                <FiFilter className="mr-2" />
                Filters
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-10 py-2 border border-gray-700 bg-slate-800 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FiChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Filters */}
          {isFilterActive && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null
                
                let displayValue = value
                if (key === 'price') {
                  const priceMap = {
                    'free': 'Free',
                    'under50': 'Under $50',
                    '50to100': '$50 - $100',
                    'over100': 'Over $100',
                    'paid': 'Paid'
                  }
                  displayValue = priceMap[value] || value
                } else if (key === 'rating') {
                  displayValue = `${value}+ Rating`
                }
                
                return (
                  <span 
                    key={key} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-gray-300"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {displayValue}
                    <button 
                      onClick={() => handleFilterChange(key, '')}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                )
              })}
              {sortBy && sortBy !== 'popular' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-gray-300">
                  Sorted by: {sortBy === 'newest' ? 'Newest' : 
                             sortBy === 'rating' ? 'Highest Rated' : 
                             sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
                  <button 
                    onClick={() => setSortBy('popular')}
                    className="ml-2 text-gray-400 hover:text-white"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button 
                onClick={clearFilters}
                className="text-sm text-primary hover:underline ml-2 self-center"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-slate-800 rounded-lg p-4 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Reset all
                </button>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary border-gray-600 focus:ring-primary"
                        checked={filters.category === category || (!filters.category && category === 'All')}
                        onChange={() => handleFilterChange('category', category)}
                      />
                      <span className="ml-2 text-sm text-gray-300">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Price</h4>
                <div className="space-y-2">
                  {[
                    { value: 'free', label: 'Free' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'under50', label: 'Under $50' },
                    { value: '50to100', label: '$50 - $100' },
                    { value: 'over100', label: 'Over $100' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary border-gray-600 focus:ring-primary"
                        checked={filters.price === option.value}
                        onChange={() => handleFilterChange('price', option.value)}
                      />
                      <span className="ml-2 text-sm text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Level */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Level</h4>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary border-gray-600 focus:ring-primary"
                        checked={filters.level === level || (!filters.level && level === 'All')}
                        onChange={() => handleFilterChange('level', level)}
                      />
                      <span className="ml-2 text-sm text-gray-300">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Rating</h4>
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary border-gray-600 focus:ring-primary"
                        checked={filters.rating === rating.toString()}
                        onChange={() => handleFilterChange('rating', rating.toString())}
                      />
                      <div className="flex items-center ml-2">
                        <span className="text-sm text-gray-300">{rating}+</span>
                        <div className="flex ml-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar 
                              key={star}
                              className={`h-3 w-3 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Duration */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Duration</h4>
                <div className="space-y-2">
                  {[
                    { value: 'short', label: '0-2 hours' },
                    { value: 'medium', label: '3-6 hours' },
                    { value: 'long', label: '7+ hours' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary border-gray-600 focus:ring-primary"
                      />
                      <div className="flex items-center ml-2">
                        <FiClock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-300">{option.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Course List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'} Found
              </h2>
              <div className="text-sm text-gray-400">
                Showing {Math.min(1, filteredCourses.length)}-{Math.min(12, filteredCourses.length)} of {filteredCourses.length}
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-slate-800 rounded-lg"></div>
                    <div className="mt-4 h-4 bg-slate-800 rounded w-3/4"></div>
                    <div className="mt-2 h-4 bg-slate-800 rounded w-1/2"></div>
                    <div className="mt-4 flex justify-between">
                      <div className="h-4 bg-slate-800 rounded w-16"></div>
                      <div className="h-8 bg-slate-800 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No courses found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Clear all filters
                </button>
              </div>
            )}
            
            {/* Pagination */}
            {filteredCourses.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button className="px-3 py-1 rounded-md text-gray-400 hover:bg-slate-800 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded-md ${
                        page === 1
                          ? 'bg-primary text-white'
                          : 'text-gray-300 hover:bg-slate-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="px-3 py-1 rounded-md text-gray-400 hover:bg-slate-800">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses
