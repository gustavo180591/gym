import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './components/common/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ClassesPage from './pages/ClassesPage'
import ClassDetailPage from './pages/ClassDetailPage'
import ProfilePage from './pages/ProfilePage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminClassesPage from './pages/AdminClassesPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="classes" element={<ProtectedRoute element={<ClassesPage />} />} />
          <Route path="classes/:id" element={<ProtectedRoute element={<ClassDetailPage />} />} />
          <Route path="profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          
          {/* Admin routes */}
          <Route 
            path="admin/users" 
            element={
              <ProtectedRoute 
                element={<AdminUsersPage />} 
                allowedRoles={['ADMIN']} 
              />
            } 
          />
          <Route 
            path="admin/classes" 
            element={
              <ProtectedRoute 
                element={<AdminClassesPage />} 
                allowedRoles={['ADMIN', 'TEACHER']} 
              />
            } 
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App 