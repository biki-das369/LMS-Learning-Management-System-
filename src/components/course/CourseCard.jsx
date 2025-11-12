import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

const CourseCard = ({ course }) => {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(course);
    
    // Reset button state after animation
    setTimeout(() => setIsAdding(false), 1000);
  };
  
  const handleGoToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/cart');
  };
  
  // Calculate discount percentage if original price is available
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) 
    : 0;

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Course Image */}
      <Link to={`/courses/${course.id}`} className="block relative">
        <img 
          src={course.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={course.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
        {course.isNew && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            New
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="text-white text-sm font-medium">{course.duration || '2h 30m'}</span>
        </div>
      </Link>

      {/* Course Content */}
      <div className="p-4 flex flex-col h-48">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
            {course.category || 'Development'}
          </span>
          <div className="flex items-center">
            <div className="flex items-center text-yellow-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium ml-1 text-gray-300">
                {course.rating || '4.5'}
              </span>
            </div>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-2 line-clamp-2 flex-grow">
          <Link to={`/courses/${course.id}`} className="hover:text-primary transition-colors">
            {course.title}
          </Link>
        </h3>

        <div className="flex items-center text-sm text-gray-400 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{course.instructor?.name || 'Instructor'}</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between">
            {hasDiscount ? (
              <div>
                <span className="text-2xl font-bold">${course.price?.toFixed(2)}</span>
                <span className="text-sm text-gray-400 line-through ml-2">${course.originalPrice?.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold">${course.price?.toFixed(2) || 'Free'}</span>
            )}
            {isInCart(course.id) ? (
              <button
                onClick={handleGoToCart}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors flex items-center"
              >
                <FiCheck className="mr-1" /> In Cart
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`px-3 py-1.5 ${
                  isAdding ? 'bg-blue-600' : 'bg-primary hover:bg-primary/90'
                } text-white text-sm font-medium rounded-md transition-colors flex items-center`}
              >
                <FiShoppingCart className="mr-1" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
