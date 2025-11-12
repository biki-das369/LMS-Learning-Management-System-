// import { Routes, Route } from 'react-router-dom'
// import { AuthProvider } from './contexts/AuthContext'
// import { CoursesProvider } from './contexts/CoursesContext'
// import { CartProvider } from './contexts/CartContext'
// import Navbar from './components/layout/Navbar'
// import Footer from './components/layout/Footer'
// import Home from './pages/Home'
// import Courses from './pages/Courses'
// import CourseDetail from './pages/CourseDetail'
// import Player from './pages/Player'
// import Checkout from './pages/Checkout'
// import Dashboard from './pages/Dashboard'
// import CreateCourse from './pages/CreateCourse'
// import Profile from './pages/Profile'

// function App() {
//   return (
//     <AuthProvider>
//       <CoursesProvider>
//         <CartProvider>
//           <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
//             <Navbar />
//             <main className="flex-1">
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/courses" element={<Courses />} />
//                 <Route path="/courses/:id" element={<CourseDetail />} />
//                 <Route path="/player/:courseId/:lectureId" element={<Player />} />
//                 <Route path="/checkout" element={<Checkout />} />
//                 <Route path="/dashboard" element={<Dashboard />} />
//                 <Route path="/create-course" element={<CreateCourse />} />
//                 <Route path="/profile" element={<Profile />} />
//               </Routes>
//             </main>
//             <Footer />
//           </div>
//         </CartProvider>
//       </CoursesProvider>
//     </AuthProvider>
//   )
// }

// export default App

import { Routes, Route } from "react-router-dom"

import { AuthProvider } from "./contexts/AuthContext"
import { CoursesProvider } from "./contexts/CoursesContext"
import { CartProvider } from "./contexts/CartContext"
import { EnrollmentProvider } from "./contexts/EnrollmentContext"

import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"

import Home from "./pages/Home"
import Courses from "./pages/Courses"
import CourseDetail from "./pages/CourseDetail"
import CoursePlayer from "./pages/CoursePlayer"
import Checkout from "./pages/Checkout"
import Cart from "./pages/Cart"
import Dashboard from "./pages/Dashboard"
import CreateCourse from "./pages/CreateCourse"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

function App() {
  return (
    <AuthProvider>
      <CoursesProvider>
        <EnrollmentProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
              
              <Navbar />

              <main className="flex-1">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />

                  {/* Player (no auth restrictions) */}
                  <Route path="/learn/:courseId/lecture/:lectureId" element={<CoursePlayer />} />

                  {/* Dashboard / Profile / Course Creation (Frontend only) */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/instructor/courses/new" element={<CreateCourse />} />
                  <Route path="/profile" element={<Profile />} />

                  {/* Cart & Checkout */}
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />

                  {/* Auth Pages (UI only) */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* 404 Fallback */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </CartProvider>
        </EnrollmentProvider>
      </CoursesProvider>
    </AuthProvider>
  )
}

export default App
