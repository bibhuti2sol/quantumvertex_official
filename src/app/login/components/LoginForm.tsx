'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import Icon from '@/components/ui/AppIcon';
import { setAuthCookie } from '@/utils/auth';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'email' && typeof value === 'string') {
      if (value && !validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    }

    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.auth.signin(), {
        username: formData.email,
        password: formData.password,
      });

      const { data, success, message } = response.data;

      if (success && data) {
        if (isHydrated) {
          // Always clear existing tokens before storing new ones to ensure freshness
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userName');

          // Store fresh token and refresh token from API response
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);

          // NEW: Store in cookie for middleware
          setAuthCookie(data.token);

          // Map API role to UI role
          let displayRole = 'Associate';
          const apiRole = data.roles && data.roles.length > 0 ? data.roles[0] : '';

          if (apiRole === 'ROLE_ADMIN') displayRole = 'Admin';
          else if (apiRole === 'ROLE_MANAGER') displayRole = 'Manager';
          else displayRole = 'Associate';

          localStorage.setItem('userRole', displayRole);

          // Store user name
          // Store user name
          const fullName =
            data.firstName && data.lastName
              ? `${data.firstName} ${data.lastName}`
              : data.firstName || data.username.split('@')[0];
          localStorage.setItem('userName', fullName);
          localStorage.setItem('userId', data.id.toString());

          // Only store email if remember me is checked
          if (formData.rememberMe) {
            localStorage.setItem('userEmail', formData.email);
          } else {
            localStorage.removeItem('userEmail');
          }

          // Force UserContext to update everywhere
          window.dispatchEvent(new Event('storage'));
        }

        onSuccess?.();
        router.push('/dashboard');
      } else {
        setErrors({
          general: message || 'Authentication failed. Please check your credentials.',
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Invalid credentials or server error. Please try again.';
      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(API_ENDPOINTS.auth.forgotPassword(), {
        email: formData.email,
      });

      // Show success message (using errors.general for simplicity or a new state if preferred,
      // but general error area is good for feedback too if styled appropriately)
      // Actually, I'll use errors.general but with a success style if I can.
      // For now, I'll just use alert or set a temporary success state.
      setErrors({ general: 'A password reset link has been sent to your email.' });
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to send reset link. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-lg shadow-elevation-3 p-8 border border-border">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <div
            className={`${errors.general.includes('sent') ? 'bg-success/10 border-success text-success' : 'bg-error/10 border-error text-error'} border rounded-md p-4 flex items-start gap-3`}
          >
            <Icon
              name={errors.general.includes('sent') ? 'CheckCircleIcon' : 'ExclamationTriangleIcon'}
              size={20}
              variant="solid"
              className="flex-shrink-0 mt-0.5"
            />
            <p className="text-sm font-caption">{errors.general}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-caption font-medium text-foreground mb-2"
          >
            Email
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
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors.email ? 'border-error' : 'border-border'
              }`}
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-error font-caption">{errors.email}</p>}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-caption font-medium text-foreground mb-2"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="KeyIcon" size={20} variant="outline" className="text-muted-foreground" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-10 pr-12 py-3 bg-background border rounded-md font-caption text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${
                errors.password ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring transition-smooth"
              disabled={isLoading}
            />
            <span className="text-sm font-caption text-foreground">Remember me</span>
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-caption text-primary hover:text-primary/80 transition-smooth"
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-caption font-semibold text-base hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <>
              <Icon name="ArrowPathIcon" size={20} variant="outline" className="animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <Icon name="ArrowRightIcon" size={20} variant="outline" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm font-caption text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-primary hover:text-accent font-semibold transition-smooth underline underline-offset-2 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm hover:scale-105"
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
