import { createContext, useContext, useState, useEffect } from 'react';

const EnrollmentContext = createContext();

export function EnrollmentProvider({ children }) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Load enrolled courses from localStorage on mount
  useEffect(() => {
    console.log('EnrollmentContext: Loading from localStorage');
    const stored = localStorage.getItem('enrolledCourses');
    console.log('EnrollmentContext: Stored data:', stored);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('EnrollmentContext: Parsed data:', parsed);
        setEnrolledCourses(parsed);
      } catch (error) {
        console.error('Failed to parse enrolled courses:', error);
        setEnrolledCourses([]);
      }
    } else {
      console.log('EnrollmentContext: No stored data found');
    }
  }, []);

  // Save to localStorage whenever enrolledCourses changes
  useEffect(() => {
    console.log('EnrollmentContext: Saving to localStorage:', enrolledCourses);
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  const enrollInCourse = (course) => {
    const isAlreadyEnrolled = enrolledCourses.some(c => c.id === course.id);
    
    if (!isAlreadyEnrolled) {
      // Parse duration from string like "52.5 hours" or "35h 20m"
      let durationHours = 0;
      if (course.duration) {
        const durationStr = String(course.duration);
        const hoursMatch = durationStr.match(/(\d+\.?\d*)\s*h/i);
        if (hoursMatch) {
          durationHours = parseFloat(hoursMatch[1]);
        } else {
          durationHours = parseFloat(durationStr) || 0;
        }
      }
      
      const enrolledCourse = {
        ...course,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        lastAccessed: new Date().toISOString(),
        completedLectures: [],
        duration: durationHours,
      };
      
      console.log('Enrolling in course:', enrolledCourse);
      setEnrolledCourses(prev => {
        const updated = [...prev, enrolledCourse];
        console.log('Updated enrolled courses:', updated);
        return updated;
      });
      return true;
    }
    return false;
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(c => c.id === courseId);
  };

  const updateCourseProgress = (courseId, lectureId) => {
    setEnrolledCourses(prev => 
      prev.map(course => {
        if (course.id === courseId) {
          const completedLectures = course.completedLectures || [];
          if (!completedLectures.includes(lectureId)) {
            completedLectures.push(lectureId);
          }
          
          const totalLectures = course.lectures?.length || 1;
          const progress = Math.round((completedLectures.length / totalLectures) * 100);
          
          return {
            ...course,
            completedLectures,
            progress,
            lastAccessed: new Date().toISOString(),
          };
        }
        return course;
      })
    );
  };

  const getEnrolledCourse = (courseId) => {
    return enrolledCourses.find(c => c.id === courseId);
  };

  const unenrollFromCourse = (courseId) => {
    setEnrolledCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const value = {
    enrolledCourses,
    enrollInCourse,
    isEnrolled,
    updateCourseProgress,
    getEnrolledCourse,
    unenrollFromCourse,
  };

  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
}

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider');
  }
  return context;
};
