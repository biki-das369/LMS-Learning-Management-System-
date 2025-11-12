import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FiShoppingCart, FiTrash2, FiArrowLeft, FiCreditCard } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const Cart = () => {
  const { items: cartItems = [], removeFromCart, updateQuantity, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading spinner
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const calculateDiscount = () => {
    // Example: 10% discount if subtotal > $100
    const subtotal = parseFloat(calculateSubtotal());
    return subtotal > 100 ? (subtotal * 0.1).toFixed(2) : 0;
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const discount = parseFloat(calculateDiscount());
    return (subtotal - discount).toFixed(2);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <FiShoppingCart className="text-4xl text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link 
              to="/courses" 
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 rounded-md text-white font-medium transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link 
            to="/courses" 
            className="flex items-center text-gray-400 hover:text-white transition-colors mr-6"
          >
            <FiArrowLeft className="mr-2" /> Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <span className="ml-4 px-3 py-1 bg-slate-800 rounded-full text-sm">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-slate-800 rounded-lg overflow-hidden flex flex-col sm:flex-row">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full sm:w-48 h-48 object-cover"
                />
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">By {item.instructor?.name || 'Instructor'}</p>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-yellow-400">★ {item.rating}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{item.students?.toLocaleString()} students</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center mb-3 sm:mb-0">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-l-md hover:bg-slate-700"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-600">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-600 rounded-r-md hover:bg-slate-700"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-xl font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button 
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center"
              >
                <FiTrash2 className="mr-1" /> Clear cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                  <span>${calculateSubtotal()}</span>
                </div>
                
                {calculateDiscount() > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-${calculateDiscount()}</span>
                  </div>
                )}
                
                <div className="border-t border-slate-700 my-4"></div>
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
                
                <div className="pt-4">
                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full py-3 bg-primary hover:bg-primary/90 rounded-md text-white font-medium flex items-center justify-center transition-colors"
                  >
                    <FiCreditCard className="mr-2" />
                    Proceed to Checkout
                  </button>
                </div>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                  By completing your purchase you agree to our Terms of Service
                </p>
                
                <div className="flex justify-center mt-6 space-x-4">
                  <img src="https://via.placeholder.com/40x25" alt="Visa" className="h-6" />
                  <img src="https://via.placeholder.com/40x25" alt="Mastercard" className="h-6" />
                  <img src="https://via.placeholder.com/40x25" alt="PayPal" className="h-6" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-slate-800 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Need help?</h3>
              <p className="text-sm text-gray-400 mb-4">
                Contact our customer support if you have any questions or need assistance.
              </p>
              <button className="text-sm text-primary hover:underline">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
