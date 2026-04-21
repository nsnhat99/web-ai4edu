import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import IntroductionPage from './pages/IntroductionPage';
import TopicsPage from './pages/TopicsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import RegistrationPage from './pages/RegistrationPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PaperReviewPage from './pages/PaperReviewPage';
import ParticipationGuidePage from './pages/ParticipationGuidePage';
import DatabaseViewPage from './pages/DatabaseViewPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { PaperProvider } from './contexts/PaperContext';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { RegistrationProvider } from './contexts/RegistrationContext';
import { AnnouncementProvider } from './contexts/AnnouncementContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <PaperProvider>
          <RegistrationProvider>
            <AnnouncementProvider>
              <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/introduction" element={<IntroductionPage />} />
                      <Route path="/topics" element={<TopicsPage />} />
                      <Route path="/schedule" element={<SchedulePage />} />
                      <Route path="/announcements" element={<AnnouncementsPage />} />
                      <Route path="/submit-abstract" element={<RegistrationPage formType="abstract" />} />
                      <Route path="/submit-full" element={<RegistrationPage formType="full" />} />
                      <Route path="/register" element={<RegistrationPage formType="attend" />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/participation-guide" element={<ParticipationGuidePage />} />
                      <Route path="/submit-paper" element={<Navigate to="/submit-full" replace />} />
                      <Route path="/paper-review" element={<PaperReviewPage />} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <AdminPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/database"
                        element={
                          <ProtectedRoute>
                            <DatabaseViewPage />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </BrowserRouter>
            </AnnouncementProvider>
          </RegistrationProvider>
        </PaperProvider>
      </SiteContentProvider>
    </AuthProvider>
  );
};

export default App;
