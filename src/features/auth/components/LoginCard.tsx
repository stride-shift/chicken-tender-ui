import React, { useState } from 'react';
import CombinedLogo from './CombinedLogo';

interface LoginCardProps {
  onLogin: (username: string, password: string) => void;
  onForgotPassword?: () => void;
  isLoading: boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({ onLogin, onForgotPassword, isLoading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="w-[380px] rounded-lg border border-border bg-card shadow-lg overflow-hidden">
      {/* Logo */}
      <div className="pt-10 px-8 mb-6">
        <CombinedLogo size="xlarge" showPixelBoot={isLoading} />
      </div>

      {isLoading ? (
        /* Loading state — logo + spinner only */
        <div className="flex flex-col items-center justify-center pb-10 pt-4">
          <p className="text-sm text-muted-foreground animate-pulse">
            Logging in...
          </p>
        </div>
      ) : (
        <>
          {/* Tagline */}
          <div className="text-xs text-muted-foreground text-center mb-8 px-8 tracking-wide font-light">
            AI-POWERED TENDER ANALYSIS
          </div>

          {/* Divider */}
          <div
            className="h-px mb-7 mx-8"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, hsl(var(--border)) 20%, hsl(var(--border)) 80%, transparent 100%)',
            }}
          />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-8 pb-10">
            {/* Username */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2 font-medium tracking-wide">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username..."
                className="h-10 w-full rounded-md bg-input px-3 py-2 text-sm border border-border focus:ring-2 focus:ring-ring focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-muted-foreground mb-2 font-medium tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="h-10 w-full rounded-md bg-input px-3 py-2 text-sm border border-border focus:ring-2 focus:ring-ring focus:outline-none transition-all duration-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-10 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-sm transition-all duration-200 mt-2 text-sm"
            >
              Sign In
            </button>

            {/* Forgot password */}
            {onForgotPassword && (
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-primary hover:underline text-sm font-medium transition-all duration-200"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default LoginCard;
