import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AddMedicationPage from './pages/AddMedicationPage';
import MedicationListPage from './pages/MedicationListPage';
import ProfilePage from './pages/ProfilePage';
import ReportPage from './pages/ReportPage';
import ChatbotPage from './pages/ChatbotPage';  // Add this line

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={
            <Layout>
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            </Layout>
          } />
          <Route path="/add-medication" element={
            <Layout>
              <PrivateRoute>
                <AddMedicationPage />
              </PrivateRoute>
            </Layout>
          } />
          <Route path="/add-medication/:id" element={
            <Layout>
              <PrivateRoute>
                <AddMedicationPage />
              </PrivateRoute>
            </Layout>
          } />
          <Route path="/medications" element={
            <Layout>
              <PrivateRoute>
                <MedicationListPage />
              </PrivateRoute>
            </Layout>
          } />
          <Route path="/profile" element={
            <Layout>
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            </Layout>
          } />
          <Route path="/report" element={
            <Layout>
              <PrivateRoute>
                <ReportPage />
              </PrivateRoute>
            </Layout>
          } />
          <Route path="/chatbot" element={
            <Layout>
              <PrivateRoute>
                <ChatbotPage />
              </PrivateRoute>
            </Layout>
          } />
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;