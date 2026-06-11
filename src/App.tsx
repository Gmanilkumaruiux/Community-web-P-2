import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ToastNotification from './components/common/Toast';
import Modal from './components/common/Modal';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CommunityFeed from './pages/CommunityFeed';
import CreatePost from './pages/CreatePost';
import MyPosts from './pages/MyPosts';
import SavedPosts from './pages/SavedPosts';
import PostDetails from './pages/PostDetails';

// Global Modal renderer connected to Notification Context state
const GlobalFeedbackModal: React.FC = () => {
  const { modal, hideModal } = useNotification();
  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={hideModal}
      title={modal.title}
      type={modal.type}
      onConfirm={modal.onConfirm}
      confirmText="Continue"
    >
      <p className="text-slate-600 text-sm whitespace-pre-wrap">{modal.message}</p>
    </Modal>
  );
};

function AppContent() {
  const { isLoading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/feed" 
            element={
              <ProtectedRoute>
                <CommunityFeed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-post" 
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-posts" 
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/saved-posts" 
            element={
              <ProtectedRoute>
                <SavedPosts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post/:id" 
            element={
              <ProtectedRoute>
                <PostDetails />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      
      {/* Absolute Overlays */}
      <ToastNotification />
      <GlobalFeedbackModal />
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}
