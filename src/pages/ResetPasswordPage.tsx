import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import CombinedLogo from '@/features/auth/components/CombinedLogo';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword, isAuthenticated, isLoading: authLoading } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Supabase auto-authenticates via the magic link URL params
  // Wait for auth to complete before showing the form
  useEffect(() => {
    // If already authenticated and we have a hash with access_token, the reset is ready
    // Supabase handles the token exchange automatically
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  // Show loading while auth state is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <CombinedLogo size="large" showPixelBoot={true} />
      </div>
    );
  }

  // If not authenticated, the link may be invalid or expired
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-lg p-8">
          <h2 className="font-serif font-semibold text-2xl text-destructive text-center mb-4">
            Link Expired
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
            This reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            type="button"
            onClick={handleGoToLogin}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-sm transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-lg p-8">
        {/* Logo */}
        <div className="mb-6">
          <CombinedLogo size="large" />
        </div>

        {/* Header */}
        <h2 className="font-serif font-semibold text-2xl text-foreground text-center mb-2">
          Set New Password
        </h2>

        <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
          Enter your new password below.
        </p>

        {success ? (
          <div>
            <div className="bg-primary/10 border border-primary rounded-md p-4 text-center mb-6">
              <p className="text-sm text-primary">
                Password updated successfully!
              </p>
            </div>
            <button
              type="button"
              onClick={handleGoToLogin}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-sm transition-all"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* New Password */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  disabled={isLoading}
                  className="h-10 w-full rounded-md bg-input px-3 py-2 text-sm border border-border focus:ring-2 focus:ring-ring focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                >
                  {showPassword ? '👁' : '👁‍🗨'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                disabled={isLoading}
                className="h-10 w-full rounded-md bg-input px-3 py-2 text-sm border border-border focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive p-3">
                <p className="text-sm text-destructive text-center">
                  {error}
                </p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-sm transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
