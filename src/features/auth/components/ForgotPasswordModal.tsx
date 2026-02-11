import React, { useState } from 'react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

export function ForgotPasswordModal({ isOpen, onClose, onSubmit }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(email);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-border bg-card shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="font-serif font-semibold text-2xl text-foreground text-center mb-2">
          Reset Password
        </h2>

        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {success ? (
          <div>
            <div className="bg-primary/10 border border-primary rounded-md p-4 text-center mb-6">
              <p className="text-sm text-primary">
                Check your email for the reset link!
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full h-10 rounded-md bg-muted text-foreground font-semibold hover:bg-muted/80 shadow-sm transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email input */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
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

            {/* Buttons */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 h-10 rounded-md bg-muted text-foreground font-semibold hover:bg-muted/80 shadow-sm transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-10 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-sm transition-all disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
