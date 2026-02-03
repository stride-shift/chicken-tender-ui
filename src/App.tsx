import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { TendersPage } from '@/pages/TendersPage'
import { RubricPage } from '@/pages/RubricPage'
import { LoginPage } from '@/pages/LoginPage'
import { ResetPasswordPage } from '@/pages/ResetPasswordPage'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ToastProvider } from '@/contexts/ToastContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { Toaster } from '@/components/ui/Toaster'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  // Show nothing while loading auth state
  if (isLoading) {
    return null
  }

  // Allow access only if authenticated
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Not authenticated - redirect to login
  return <Navigate to="/login" replace />
}

// Dev bypass removed: All authentication now goes through Supabase Auth.
// Previous dev mode used VITE_DEV_CLIENT_CODE environment variable.

export default function App() {
  return (
    <ToastProvider>
      <SidebarProvider>
        <ErrorBoundary>
          <Routes>
            {/* Login route - outside AppShell for full-screen experience */}
            <Route path="/login" element={<LoginPage />} />

            {/* Password reset route - outside AppShell, handles Supabase callback */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected routes - wrapped in AppShell */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppShell>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/tenders" element={<TendersPage />} />
                      <Route path="/tenders/:tenderId" element={<TendersPage />} />
                      <Route path="/rubric" element={<RubricPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </AppShell>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
        <Toaster />
      </SidebarProvider>
    </ToastProvider>
  )
}
