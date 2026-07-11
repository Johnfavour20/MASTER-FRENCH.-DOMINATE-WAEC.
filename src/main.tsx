import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

import ErrorBoundary from './components/ErrorBoundary';
import { AuthGuard } from './components/guards/AuthGuard';
import { OnboardingGuard } from './components/guards/OnboardingGuard';
import { PaymentGuard } from './components/guards/PaymentGuard';
import PlatformLayout from './layouts/PlatformLayout';
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import VerifyEmailPage from './pages/public/VerifyEmailPage';

// Payment Pages
import PlanSelectionPage from './pages/payment/PlanSelectionPage';

// Platform Pages
import DashboardPage from './pages/platform/DashboardPage';
import ParcoursPage from './pages/platform/ParcoursPage';
import LessonPage from './pages/platform/LessonPage';
import BlitzPage from './pages/platform/BlitzPage';
import BlitzResultsPage from './pages/platform/BlitzResultsPage';
import ExamensPage from './pages/platform/ExamensPage';
import ExamResultsPage from './pages/platform/ExamResultsPage';

// Onboarding
import OnboardingPage from './pages/onboarding/OnboardingPage';

// Initialize React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,  // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
            </Route>

            {/* Payment Routes (requires auth) */}
            <Route element={<AuthGuard />}>
              <Route path="/plan-selection" element={<PlanSelectionPage />} />
            </Route>

            {/* Onboarding Routes (requires auth, requires payment check) */}
            <Route element={<AuthGuard />}>
              <Route element={<PaymentGuard />}>
                <Route path="/onboarding" element={<OnboardingPage />} />
              </Route>
            </Route>

            {/* Platform Routes (requires auth, requires onboarding, requires payment) */}
            <Route element={<AuthGuard />}>
              <Route element={<OnboardingGuard />}>
                <Route element={<PaymentGuard />}>
                  <Route element={<PlatformLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/parcours" element={<ParcoursPage />} />
                    <Route path="/lesson/:id" element={<LessonPage />} />
                    <Route path="/blitz" element={<BlitzPage />} />
                    <Route path="/blitz-results" element={<BlitzResultsPage />} />
                    <Route path="/examens" element={<ExamensPage />} />
                    <Route path="/exam-results/:id" element={<ExamResultsPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);
