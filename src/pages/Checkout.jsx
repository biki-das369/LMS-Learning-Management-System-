import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useEnrollment } from '../contexts/EnrollmentContext';
import { useCourses } from '../contexts/CoursesContext';
import { FiShoppingCart, FiCreditCard, FiArrowLeft } from 'react-icons/fi';

const Checkout = () => {
  const { items: cart = [], clearCart } = useCart();
  const { enrollInCourse } = useEnrollment();
  const { getCourseById } = useCourses();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const calculateTotal = () => {
    if (!cart || !Array.isArray(cart)) return '0.00';
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      const discount = item.discount || 0;
      return total + (price * (1 - discount / 100));
    }, 0).toFixed(2);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enroll user in all courses in cart
      console.log('Enrolling in courses from cart:', cart);
      cart.forEach(cartItem => {
        // Get full course data from CoursesContext
        const fullCourse = getCourseById(cartItem.id);
        if (fullCourse) {
          console.log('Enrolling in course:', fullCourse.title);
          enrollInCourse(fullCourse);
        } else {
          // If course not found in context, use cart item data
          console.log('Enrolling with cart data:', cartItem.title);
          enrollInCourse(cartItem);
        }
      });
      
      clearCart();
      setIsSuccess(true);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Ensure cart is an array before checking length
  if (!cart || !Array.isArray(cart) || (cart.length === 0 && !isSuccess)) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pt-20">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <FiShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add some courses to your cart before checking out</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-md text-white font-medium"
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pt-20">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-400 mb-6">Thank you for your purchase. You can now access your courses in your dashboard.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-primary hover:bg-primary/90 rounded-md text-white font-medium"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-2 border border-gray-600 hover:bg-slate-800 rounded-md text-white font-medium"
              >
                Find More Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-slate-800 rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              {cart.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b border-slate-700">
                  <div className="flex-shrink-0 w-24 h-16 bg-slate-700 rounded-md overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-400">
                      {typeof item.instructor === 'object' ? item.instructor.name : 'Instructor'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                      {item.discount > 0 && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          ${item.price.toFixed(2)}
                        </span>
                      )}
                    </p>
                    {item.discount > 0 && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                        {item.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Discount</span>
                  <span className="text-green-400">$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-slate-700">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-slate-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-6">Payment Details</h2>
              
              <form onSubmit={handleCheckout}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Card Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-md font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? 'Processing...' : `Pay $${calculateTotal()}`}
                </button>

                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-sm text-gray-400 hover:text-white flex items-center justify-center mx-auto"
                  >
                    <FiArrowLeft className="mr-1 h-4 w-4" />
                    Back to cart
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p>Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
