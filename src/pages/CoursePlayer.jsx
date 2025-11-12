import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize2, FiMinimize2, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiCheck, FiLock, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useEnrollment } from '../contexts/EnrollmentContext';

const CoursePlayer = () => {
  const { courseId, lectureId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getEnrolledCourse, updateCourseProgress } = useEnrollment();
  
  console.log('CoursePlayer - courseId:', courseId, 'lectureId:', lectureId);
  
  // Refs
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const volumeBarRef = useRef(null);
  const playerContainerRef = useRef(null);
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showPlaybackSpeed, setShowPlaybackSpeed] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('course-content');
  const [completedLectures, setCompletedLectures] = useState([]);
  
  // Get enrolled course data
  const enrolledCourse = getEnrolledCourse(courseId);
  
  // Update completed lectures when enrolled course data is available
  useEffect(() => {
    if (enrolledCourse?.completedLectures) {
      setCompletedLectures(enrolledCourse.completedLectures);
    }
  }, [enrolledCourse]);
  
  // Mock data - in a real app, this would come from an API
  const [course, setCourse] = useState({
    id: courseId,
    title: 'The Complete Web Development Bootcamp',
    instructor: 'John Doe',
    thumbnail: 'https://via.placeholder.com/800x450',
    progress: 35,
    curriculum: [
      {
        id: 'section-1',
        title: 'Getting Started',
        lectures: [
          { id: 'lecture-1', title: 'Welcome to the Course', type: 'video', duration: '5:30', preview: true, completed: true },
          { id: 'lecture-2', title: 'Course Overview', type: 'video', duration: '10:15', preview: false, completed: true },
          { id: 'lecture-3', title: 'Setting Up Your Environment', type: 'video', duration: '12:45', preview: true, completed: true },
        ]
      },
      {
        id: 'section-2',
        title: 'HTML Fundamentals',
        lectures: [
          { id: 'lecture-4', title: 'Introduction to HTML', type: 'video', duration: '15:30', preview: true, completed: true },
          { id: 'lecture-5', title: 'HTML Document Structure', type: 'video', duration: '12:45', preview: false, completed: true },
          { id: 'lecture-6', title: 'Working with Text', type: 'video', duration: '18:20', preview: false, completed: false },
          { id: 'lecture-7', title: 'Links and Images', type: 'video', duration: '14:10', preview: true, completed: false },
        ]
      },
      {
        id: 'section-3',
        title: 'CSS Fundamentals',
        lectures: [
          { id: 'lecture-8', title: 'Introduction to CSS', type: 'video', duration: '16:30', preview: true, completed: false },
          { id: 'lecture-9', title: 'CSS Selectors', type: 'video', duration: '14:20', preview: false, completed: false },
          { id: 'lecture-10', title: 'Box Model', type: 'video', duration: '20:10', preview: false, completed: false },
        ]
      },
      {
        id: 'section-4',
        title: 'JavaScript Basics',
        lectures: [
          { id: 'lecture-11', title: 'Introduction to JavaScript', type: 'video', duration: '18:45', preview: true, completed: false },
          { id: 'lecture-12', title: 'Variables and Data Types', type: 'video', duration: '22:15', preview: false, completed: false },
          { id: 'lecture-13', title: 'Functions and Scope', type: 'video', duration: '25:30', preview: false, completed: false },
        ]
      },
    ]
  });
  
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  
  // Set initial lecture from URL or first available lecture
  useEffect(() => {
    console.log('Setting up lecture, course:', course, 'lectureId:', lectureId);
    if (course) {
      if (lectureId) {
        // Find the lecture in the curriculum
        let foundLecture = null;
        for (const section of course.curriculum) {
          const lecture = section.lectures.find(l => l.id === lectureId);
          if (lecture) {
            foundLecture = { ...lecture, sectionId: section.id };
            break;
          }
        }
        
        console.log('Found lecture:', foundLecture);
        if (foundLecture) {
          setCurrentLecture(foundLecture);
          setExpandedSections(prev => ({ ...prev, [foundLecture.sectionId]: true }));
        } else {
          // If lecture not found, redirect to first available lecture
          console.log('Lecture not found, redirecting to first lecture');
          const firstSection = course.curriculum[0];
          const firstLecture = firstSection.lectures[0];
          navigate(`/learn/${courseId}/lecture/${firstLecture.id}`, { replace: true });
        }
      } else {
        // If no lecture ID in URL, redirect to first available lecture
        console.log('No lectureId, redirecting to first lecture');
        const firstSection = course.curriculum[0];
        const firstLecture = firstSection.lectures[0];
        navigate(`/learn/${courseId}/lecture/${firstLecture.id}`, { replace: true });
      }
      
      setLoading(false);
    }
  }, [course, courseId, lectureId, navigate]);
  
  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      markLectureAsCompleted(currentLecture.id);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentLecture]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current) return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'arrowleft':
          e.preventDefault();
          seek(-5);
          break;
        case 'arrowright':
          e.preventDefault();
          seek(5);
          break;
        case 'arrowup':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case '>':
        case '.':
          if (playbackRate < 2) {
            setPlaybackRate(prev => {
              const newRate = Math.min(prev + 0.25, 2);
              videoRef.current.playbackRate = newRate;
              return newRate;
            });
          }
          break;
        case '<':
        case ',':
          if (playbackRate > 0.5) {
            setPlaybackRate(prev => {
              const newRate = Math.max(prev - 0.25, 0.5);
              videoRef.current.playbackRate = newRate;
              return newRate;
            });
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playbackRate]);
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Video controls
  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  const seek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };
  
  const handleProgressBarClick = (e) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeBarClick = (e) => {
    if (!volumeBarRef.current) return;
    
    const rect = volumeBarRef.current.getBoundingClientRect();
    let newVolume = (e.clientX - rect.left) / rect.width;
    newVolume = Math.max(0, Math.min(1, newVolume)); // Clamp between 0 and 1
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };
  
  const adjustVolume = (delta) => {
    if (!videoRef.current) return;
    
    let newVolume = videoRef.current.volume + delta;
    newVolume = Math.max(0, Math.min(1, newVolume)); // Clamp between 0 and 1
    
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowPlaybackSpeed(false);
    }
  };
  
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  const navigateToLecture = (lecture, sectionId) => {
    setCurrentLecture({ ...lecture, sectionId });
    navigate(`/learn/${courseId}/lecture/${lecture.id}`);
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  };
  
  const navigateToNextLecture = () => {
    if (!currentLecture) return;
    
    let nextLecture = null;
    let currentSectionIndex = -1;
    let currentLectureIndex = -1;
    
    // Find current lecture and section indices
    for (let i = 0; i < course.curriculum.length; i++) {
      const section = course.curriculum[i];
      const lectureIndex = section.lectures.findIndex(l => l.id === currentLecture.id);
      
      if (lectureIndex !== -1) {
        currentSectionIndex = i;
        currentLectureIndex = lectureIndex;
        break;
      }
    }
    
    if (currentSectionIndex === -1 || currentLectureIndex === -1) return;
    
    // Check if there's a next lecture in the current section
    const currentSection = course.curriculum[currentSectionIndex];
    if (currentLectureIndex < currentSection.lectures.length - 1) {
      nextLecture = {
        ...currentSection.lectures[currentLectureIndex + 1],
        sectionId: currentSection.id
      };
    } else {
      // Try to find the first lecture in the next section
      for (let i = currentSectionIndex + 1; i < course.curriculum.length; i++) {
        const nextSection = course.curriculum[i];
        if (nextSection.lectures.length > 0) {
          nextLecture = {
            ...nextSection.lectures[0],
            sectionId: nextSection.id
          };
          break;
        }
      }
    }
    
    if (nextLecture) {
      setCurrentLecture(nextLecture);
      navigate(`/learn/${courseId}/lecture/${nextLecture.id}`);
    }
  };
  
  const navigateToPreviousLecture = () => {
    if (!currentLecture) return;
    
    let prevLecture = null;
    let currentSectionIndex = -1;
    let currentLectureIndex = -1;
    
    // Find current lecture and section indices
    for (let i = 0; i < course.curriculum.length; i++) {
      const section = course.curriculum[i];
      const lectureIndex = section.lectures.findIndex(l => l.id === currentLecture.id);
      
      if (lectureIndex !== -1) {
        currentSectionIndex = i;
        currentLectureIndex = lectureIndex;
        break;
      }
    }
    
    if (currentSectionIndex === -1 || currentLectureIndex === -1) return;
    
    // Check if there's a previous lecture in the current section
    if (currentLectureIndex > 0) {
      const currentSection = course.curriculum[currentSectionIndex];
      prevLecture = {
        ...currentSection.lectures[currentLectureIndex - 1],
        sectionId: currentSection.id
      };
    } else if (currentSectionIndex > 0) {
      // Try to find the last lecture in the previous section
      for (let i = currentSectionIndex - 1; i >= 0; i--) {
        const prevSection = course.curriculum[i];
        if (prevSection.lectures.length > 0) {
          prevLecture = {
            ...prevSection.lectures[prevSection.lectures.length - 1],
            sectionId: prevSection.id
          };
          break;
        }
      }
    }
    
    if (prevLecture) {
      setCurrentLecture(prevLecture);
      navigate(`/learn/${courseId}/lecture/${prevLecture.id}`);
    }
  };
  
  const markLectureAsCompleted = (lectureId) => {
    if (!completedLectures.includes(lectureId)) {
      setCompletedLectures(prev => [...prev, lectureId]);
      
      // Update progress in EnrollmentContext
      updateCourseProgress(courseId, lectureId);
    }
  };
  
  // Calculate course progress
  const totalLectures = course.curriculum.reduce((total, section) => total + section.lectures.length, 0);
  const completedCount = completedLectures.length;
  const progress = Math.round((completedCount / totalLectures) * 100) || 0;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Please sign in to access this course</h1>
        <p className="text-gray-300 mb-8">You need to be logged in to view the course content.</p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 border border-gray-600 text-white rounded-md hover:bg-slate-800 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-black text-white pt-16">
      {/* Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between fixed top-16 left-0 right-0 z-40">
        <div className="flex items-center">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden mr-4 text-gray-400 hover:text-white"
          >
            {showSidebar ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <Link to="/" className="text-xl font-bold text-white">
            LMS
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <Link to={`/courses/${courseId}`} className="text-gray-300 hover:text-white truncate max-w-xs">
            {course.title}
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-gray-400">Progress:</span>{' '}
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden mt-16">
        {/* Sidebar */}
        <aside 
          className={`fixed lg:static inset-y-0 left-0 z-20 w-80 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${
            showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">Course Content</h2>
              <div className="mt-2 text-sm text-gray-400">
                {completedCount} of {totalLectures} lectures • {progress}% complete
              </div>
              <div className="mt-2 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {course.curriculum.map((section) => (
                  <div key={section.id} className="mb-2">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex justify-between items-center p-3 text-left text-sm font-medium text-white hover:bg-slate-800 rounded-md"
                    >
                      <span>{section.title}</span>
                      {expandedSections[section.id] ? (
                        <FiChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <FiChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedSections[section.id] && (
                      <div className="ml-4 mt-1 space-y-1">
                        {section.lectures.map((lecture) => {
                          const isCurrent = currentLecture && currentLecture.id === lecture.id;
                          const isCompleted = completedLectures.includes(lecture.id);
                          const isLocked = !lecture.preview && !isCompleted && !isCurrent;
                          
                          return (
                            <button
                              key={lecture.id}
                              onClick={() => !isLocked && navigateToLecture(lecture, section.id)}
                              disabled={isLocked}
                              className={`w-full flex items-center p-2 text-sm rounded-md transition ${
                                isCurrent 
                                  ? 'bg-primary/20 text-primary' 
                                  : 'text-gray-300 hover:bg-slate-800'
                              } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-2">
                                {isCompleted ? (
                                  <FiCheck className="h-4 w-4 text-green-500" />
                                ) : isLocked ? (
                                  <FiLock className="h-3 w-3 text-gray-500" />
                                ) : (
                                  <FiPlay className="h-3 w-3 text-gray-400" />
                                )}
                              </div>
                              <span className="text-left truncate">
                                {lecture.title}
                                {lecture.preview && !isCompleted && !isCurrent && (
                                  <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                                    Preview
                                  </span>
                                )}
                              </span>
                              <span className="ml-auto text-xs text-gray-500">
                                {lecture.duration}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-800">
              <Link
                to={`/courses/${courseId}`}
                className="block w-full text-center px-4 py-2 border border-slate-700 rounded-md text-sm font-medium text-white hover:bg-slate-800 transition"
              >
                Back to Course
              </Link>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-black">
          {/* Video Player */}
          <div 
            ref={playerContainerRef}
            className="relative flex-1 bg-black flex items-center justify-center"
          >
            <div className="w-full h-full max-w-[2000px] mx-auto">
              <div className="relative w-full h-0 pb-[56.25%] bg-black">
                <video
                  ref={videoRef}
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  className="absolute inset-0 w-full h-full"
                  onClick={togglePlayPause}
                  poster={course.thumbnail}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
                
                {/* Video Overlay Controls */}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      togglePlayPause();
                    }
                  }}
                >
                  <button 
                    onClick={togglePlayPause}
                    className="bg-black bg-opacity-70 rounded-full p-4 text-white hover:bg-opacity-90 focus:outline-none"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <FiPause className="h-8 w-8" />
                    ) : (
                      <FiPlay className="h-8 w-8 ml-1" />
                    )}
                  </button>
                </div>
                
                {/* Top Gradient Overlay */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/70 to-transparent"></div>
                
                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Progress Bar */}
                  <div 
                    ref={progressBarRef}
                    className="h-1.5 bg-slate-700 rounded-full mb-3 cursor-pointer"
                    onClick={handleProgressBarClick}
                  >
                    <div 
                      className="h-full bg-primary rounded-full relative"
                      style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    >
                      <div className="absolute right-0 -top-1 h-3 w-3 bg-white rounded-full transform translate-x-1/2"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause Button */}
                      <button 
                        onClick={togglePlayPause}
                        className="text-white hover:text-gray-200 focus:outline-none"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <FiPause className="h-5 w-5" />
                        ) : (
                          <FiPlay className="h-5 w-5" />
                        )}
                      </button>
                      
                      {/* Volume Controls */}
                      <div className="flex items-center">
                        <button 
                          onClick={toggleMute}
                          className="text-white hover:text-gray-200 focus:outline-none"
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted || volume === 0 ? (
                            <FiVolumeX className="h-5 w-5" />
                          ) : volume < 0.5 ? (
                            <FiVolume2 className="h-5 w-5" />
                          ) : (
                            <FiVolume2 className="h-5 w-5" />
                          )}
                        </button>
                        
                        <div 
                          ref={volumeBarRef}
                          className="ml-2 w-20 h-1 bg-slate-600 rounded-full cursor-pointer"
                          onClick={handleVolumeBarClick}
                        >
                          <div 
                            className="h-full bg-white rounded-full"
                            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Time Display */}
                      <div className="text-sm text-white select-none">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Playback Speed */}
                      <div className="relative">
                        <button 
                          onClick={() => setShowPlaybackSpeed(!showPlaybackSpeed)}
                          className="text-sm text-white hover:text-gray-200 focus:outline-none"
                        >
                          {playbackRate}x
                        </button>
                        
                        {showPlaybackSpeed && (
                          <div className="absolute bottom-full right-0 mb-2 w-24 bg-slate-800 rounded-md shadow-lg py-1 z-10">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => changePlaybackRate(rate)}
                                className={`block w-full text-left px-4 py-1 text-sm ${
                                  playbackRate === rate 
                                    ? 'bg-primary text-white' 
                                    : 'text-gray-300 hover:bg-slate-700'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Fullscreen Toggle */}
                      <button 
                        onClick={toggleFullscreen}
                        className="text-white hover:text-gray-200 focus:outline-none"
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                      >
                        {isFullscreen ? (
                          <FiMinimize2 className="h-5 w-5" />
                        ) : (
                          <FiMaximize2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Arrows */}
                <>
                  <button 
                    onClick={navigateToPreviousLecture}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Previous lecture"
                  >
                    <FiChevronLeft className="h-6 w-6" />
                  </button>
                  
                  <button 
                    onClick={navigateToNextLecture}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label="Next lecture"
                  >
                    <FiChevronRight className="h-6 w-6" />
                  </button>
                </>
              </div>
            </div>
          </div>
          
          {/* Lecture Info and Tabs */}
          <div className="bg-slate-900 border-t border-slate-800">
            <div className="max-w-5xl mx-auto px-4 py-6">
              <h1 className="text-xl font-semibold text-white mb-2">
                {currentLecture?.title || 'Loading...'}
              </h1>
              
              <div className="flex items-center text-sm text-gray-400 mb-6">
                <span>Lecture {currentLecture ? (() => {
                  let lectureNumber = 0;
                  for (const section of course.curriculum) {
                    const index = section.lectures.findIndex(l => l.id === currentLecture.id);
                    if (index !== -1) {
                      lectureNumber += index + 1;
                      break;
                    } else {
                      lectureNumber += section.lectures.length;
                    }
                  }
                  return lectureNumber;
                })() : 0} • {currentLecture?.duration}</span>
                
                {currentLecture?.preview && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    Preview
                  </span>
                )}
                
                {completedLectures.includes(currentLecture?.id) && (
                  <span className="ml-2 flex items-center text-green-400 text-sm">
                    <FiCheck className="h-4 w-4 mr-1" />
                    Completed
                  </span>
                )}
              </div>
              
              <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-8">
                  {['Course Content', 'Resources', 'Q&A', 'Notes'].map((tab) => {
                    const tabId = tab.toLowerCase().replace(/\s+/g, '-');
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
                    );
                  })}
                </nav>
              </div>
              
              <div className="mt-6">
                {activeTab === 'course-content' && (
                  <div className="prose prose-invert max-w-none">
                    <h3 className="text-lg font-semibold text-white mb-4">About this lecture</h3>
                    <p className="text-gray-300">
                      This is a sample lecture in the course. In a real application, this would contain the actual lecture content, 
                      including video, text, code examples, and other learning materials.
                    </p>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4">Lecture Resources</h3>
                      <div className="space-y-2">
                        {[
                          { name: 'Lecture Slides (PDF)', type: 'pdf', size: '2.4 MB' },
                          { name: 'Source Code (ZIP)', type: 'zip', size: '1.2 MB' },
                          { name: 'Additional Reading', type: 'link', url: '#' },
                        ].map((resource, index) => (
                          <div key={index} className="flex items-center p-3 bg-slate-800 rounded-md hover:bg-slate-700">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-slate-700 rounded-md mr-3">
                              {resource.type === 'pdf' && (
                                <span className="text-red-400 text-sm font-medium">PDF</span>
                              )}
                              {resource.type === 'zip' && (
                                <span className="text-blue-400 text-sm font-medium">ZIP</span>
                              )}
                              {resource.type === 'link' && (
                                <span className="text-green-400 text-sm font-medium">URL</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {resource.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {resource.size || 'Link'}
                              </p>
                            </div>
                            <button className="ml-2 text-sm font-medium text-primary hover:text-primary/80">
                              {resource.type === 'link' ? 'Open' : 'Download'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'resources' && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-white mb-2">No resources available</h3>
                    <p className="text-gray-400">The instructor hasn't uploaded any additional resources for this lecture.</p>
                  </div>
                )}
                
                {activeTab === 'q&a' && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-white mb-2">No questions yet</h3>
                    <p className="text-gray-400 mb-6">Have a question about this lecture? Ask it below.</p>
                    <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
                      Ask a Question
                    </button>
                  </div>
                )}
                
                {activeTab === 'notes' && (
                  <div>
                    <div className="mb-4">
                      <textarea
                        className="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Add your notes here..."
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition">
                          Save Notes
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-white mb-4">Your Notes</h3>
                      <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-lg">
                        <p className="text-gray-400">You haven't taken any notes yet.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePlayer;
