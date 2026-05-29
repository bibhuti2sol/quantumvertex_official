'use client';

import { useState, useEffect, Suspense } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const ForgetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const tokenParam = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    email: emailParam,
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (emailParam && !formData.email) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [emailParam]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: any = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.newPassword) {
      newErrors.password = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.general = 'Passwords do not match';
    }

    if (!tokenParam) {
      newErrors.general = 'Reset token is missing. Please use the link from your email.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.resetPassword(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: tokenParam,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      if (response.ok) {
        setResetSuccess(true);
        // Redirect to login after success
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrors({
          general: errorData.message || 'Failed to reset password. The link may be expired.',
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: 'Network error. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-elevation-3 p-8 border border-border">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-white font-bold text-2xl font-heading">N</span>
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Reset Password</h1>
          <p className="text-sm font-caption text-muted-foreground mt-2">
            Enter your details below to reset your account password.
          </p>
        </div>

        {resetSuccess && (
          <div className="mb-6 bg-success/10 border border-success rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <Icon
              name="CheckCircleIcon"
              size={20}
              variant="solid"
              className="text-success flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm text-success font-caption font-bold">Successfully Reset!</p>
              <p className="text-xs text-success/80 font-caption mt-0.5">
                Your password has been updated. Redirecting to login...
              </p>
            </div>
          </div>
        )}

        {errors.general && !resetSuccess && (
          <div className="mb-6 bg-error/10 border border-error rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <Icon
              name="ExclamationTriangleIcon"
              size={20}
              variant="solid"
              className="text-error flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-error font-caption">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleResetSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-caption font-medium text-foreground mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon
                  name="EnvelopeIcon"
                  size={20}
                  variant="outline"
                  className="text-muted-foreground"
                />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className={`w-full pl-10 pr-4 py-3 bg-background border rounded-xl font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors.email ? 'border-error' : 'border-border'
                }`}
                placeholder="you@example.com"
                disabled={isLoading || resetSuccess}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-error font-caption">{errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-caption font-medium text-foreground mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon
                  name="KeyIcon"
                  size={20}
                  variant="outline"
                  className="text-muted-foreground"
                />
              </div>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                className={`w-full pl-10 pr-12 py-3 bg-background border rounded-xl font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                  errors.password ? 'border-error' : 'border-border'
                }`}
                placeholder="Minimum 8 characters"
                disabled={isLoading || resetSuccess}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading || resetSuccess}
              >
                <Icon
                  name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                  size={20}
                  variant="outline"
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                />
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-error font-caption">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-caption font-medium text-foreground mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon
                  name="KeyIcon"
                  size={20}
                  variant="outline"
                  className="text-muted-foreground"
                />
              </div>
              <input
                id="confirm-password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                placeholder="Confirm your new password"
                disabled={isLoading || resetSuccess}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || resetSuccess}
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3.5 rounded-xl font-caption font-bold text-base hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <Icon name="ArrowPathIcon" size={20} variant="outline" className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Reset Password</span>
            )}
          </button>

          <div className="pt-4 text-center">
            <Link
              href="/login"
              className="text-sm font-caption text-primary hover:text-accent transition-smooth font-bold"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const ForgetPasswordInteractive = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ForgetPasswordForm />
    </Suspense>
  );
};

export default ForgetPasswordInteractive;
