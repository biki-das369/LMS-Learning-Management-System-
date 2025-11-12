import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error parsing cart data:', error)
        localStorage.removeItem('cart')
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items))
    } else {
      localStorage.removeItem('cart')
    }
  }, [items])

  const addToCart = (course, quantity = 1) => {
    setItems(prevItems => {
      // Check if course is already in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === course.id);
      
      if (existingItemIndex >= 0) {
        // If course is already in cart, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + quantity
        };
        return updatedItems;
      }
      
      // Otherwise add the new course to cart with quantity
      return [...prevItems, { 
        ...course, 
        quantity: quantity,
        addedAt: new Date().toISOString() 
      }];
    });
  };

  const removeFromCart = (courseId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== courseId))
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem('cart')
  }

  const updateQuantity = (courseId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === courseId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const itemPrice = item.price || 0;
      const itemQuantity = item.quantity || 1;
      return total + (itemPrice * itemQuantity);
    }, 0).toFixed(2);
  }

  const isInCart = (courseId) => {
    return items.some(item => item.id === courseId)
  }

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  const value = {
    items,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    toggleCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
