'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/config/api';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import PublicFooter from '@/components/layout/PublicFooter';

const pricingPlans = [
  {
    name: 'Basic',
    bestFor: 'SMBs / Startups',
    monthly: '₹75,000',
    annual: '₹7,92,000',
    includedUsers: 'Up to 10',
    extraUserCost: '₹3,000 / user',
  },
  {
    name: 'Enterprise',
    bestFor: 'Mid–Large Orgs',
    monthly: '₹2,00,000',
    annual: '₹21,12,000',
    includedUsers: 'Up to 100',
    extraUserCost: '₹1,500 / user',
  },
  {
    name: 'Customized',
    bestFor: 'Large / Regulated',
    monthly: '₹3,50,000+',
    annual: 'Custom Quote',
    includedUsers: 'Custom',
    extraUserCost: 'Custom',
  },
];

const features = [
  {
    name: 'Task & Workflow Management',
    trial: true,
    basic: true,
    enterprise: true,
    customized: true,
  },
  {
    name: 'Realtime Collaboration',
    trial: true,
    basic: true,
    enterprise: true,
    customized: true,
  },
  {
    name: 'Standard Integrations (Email, Chat)',
    trial: true,
    basic: true,
    enterprise: true,
    customized: true,
  },
  {
    name: 'Automation Rules',
    trial: 'Limited',
    basic: 'Standard',
    enterprise: 'Advanced',
    customized: 'Unlimited',
  },
  {
    name: 'Reporting & Dashboards',
    trial: 'Basic',
    basic: 'Standard',
    enterprise: 'Advanced',
    customized: 'Custom',
  },
  {
    name: 'User Roles & Permissions',
    trial: 'Limited',
    basic: true,
    enterprise: true,
    customized: true,
  },
  {
    name: 'Audit Logs',
    trial: false,
    basic: false,
    enterprise: true,
    customized: true,
  },
  {
    name: 'SSO / SCIM',
    trial: false,
    basic: false,
    enterprise: true,
    customized: true,
  },
  {
    name: 'SLA',
    trial: false,
    basic: false,
    enterprise: '99.9%',
    customized: 'Custom (99.9%–99.99%)',
  },
  {
    name: 'Support',
    trial: 'Email',
    basic: 'Email',
    enterprise: '24×7 Priority',
    customized: 'Dedicated Team',
  },
  {
    name: 'Dedicated Infrastructure',
    trial: false,
    basic: false,
    enterprise: false,
    customized: true,
  },
];

const featureTags = [
  'Task Management',
  'Project Management',
  'Time Tracking',
  'Workflow Automation',
  'Document Management',
  'Attendance Tracking',
  'Leave Management',
  'Collaboration',
];

import SuccessModal from '@/components/common/SuccessModal';
import { setAuthCookie } from '@/utils/auth';

export default function SignupPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organizationName: '',
    address: '',
    state: '',
    city: '',
    pinCode: '',
    contactNo: '',
    teamSize: 0,
    subscriptionType: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'teamSize' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubscriptionSelect = (type: string) => {
    const mappedType = type.toUpperCase();
    setFormData((prev) => ({ ...prev, subscriptionType: mappedType }));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: null, message: '' });

    const payload = {
      ...formData,
      roles: ['ROLE_ADMIN'],
    };

    try {
      const response = await axios.post(API_ENDPOINTS.auth.signup(), payload);

      // If signup returns a token, set the cookie
      if (response.data.data?.token) {
        setAuthCookie(response.data.data.token);
      }

      if (response.data.message) {
        setSuccessMessage(response.data.message);
        setShowSuccessModal(true);
      } else {
        setStatus({
          type: 'success',
          message: 'Signup successful! Redirecting to login...',
        });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Something went wrong. Please try again.';
      setStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Left: Illustration & Welcome */}
        <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:rounded-r-[3rem] shadow-2xl relative overflow-hidden min-h-[480px]">
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-center items-stretch">
              {/* Free Card */}
              <div className="flex-1 bg-white/90 rounded-2xl shadow-xl border border-border p-3 flex flex-col items-center min-w-[150px] max-w-[200px] cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:border-primary/50 group">
                <h3 className="text-xl font-semibold mb-2 text-primary group-hover:scale-110 transition-transform">
                  Free
                </h3>
                <div className="text-3xl font-bold text-primary mb-1">₹0</div>
                <div className="text-xs text-muted-foreground mb-4">Individuals / Evaluation</div>
                <ul className="text-sm text-left space-y-2 mb-6 w-full">
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> Up to 3 users
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> All core features
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> No cost, no credit card
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscriptionSelect('FREE')}
                  className="mt-auto bg-gradient-to-r from-primary to-accent text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                >
                  Start Free
                </button>
              </div>
              {/* Basic Card */}
              <div className="flex-1 bg-white rounded-2xl shadow-xl border border-primary/30 p-3 flex flex-col items-center min-w-[150px] max-w-[200px] cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:border-primary group">
                <h3 className="text-xl font-semibold mb-2 text-primary group-hover:scale-110 transition-transform">
                  Basic
                </h3>
                <div className="text-3xl font-bold text-primary mb-1">₹75,000</div>
                <div className="text-xs text-muted-foreground mb-4">SMBs / Startups</div>
                <ul className="text-sm text-left space-y-2 mb-6 w-full">
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> Up to 10 users
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> ₹3,000 / extra user
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> All features included
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscriptionSelect('BASIC')}
                  className="mt-auto bg-gradient-to-r from-primary to-accent text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>
              {/* Enterprise Card (Highlighted) */}
              <div className="flex-1 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-2xl border-4 border-primary/60 p-4 flex flex-col items-center min-w-[170px] max-w-[220px] relative scale-105 z-10 cursor-pointer transition-all duration-300 hover:scale-[1.08] hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:z-20 group">
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:scale-110 transition-transform">
                  Enterprise
                </h3>
                <div className="text-3xl font-bold text-white mb-1">₹2,00,000</div>
                <div className="text-xs text-white/80 mb-4">Mid–Large Orgs</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-300 text-primary font-bold px-2 py-1 rounded-full text-xs">
                    12% Off
                  </span>
                  <span className="bg-white text-primary font-semibold px-2 py-1 rounded-full text-xs">
                    Most Recommended
                  </span>
                </div>
                <ul className="text-sm text-left space-y-2 mb-6 w-full text-white">
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> Up to 100 users
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> ₹1,500 / extra user
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> All features included
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscriptionSelect('ENTERPRISE')}
                  className="mt-auto bg-white text-primary font-bold px-6 py-2 rounded-full shadow transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                >
                  Buy Now
                </button>
              </div>
              {/* Customized Card */}
              <div className="flex-1 bg-white rounded-2xl shadow-xl border border-primary/30 p-3 flex flex-col items-center min-w-[150px] max-w-[200px] cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:border-primary group">
                <h3 className="text-xl font-semibold mb-2 text-primary group-hover:scale-110 transition-transform">
                  Customized
                </h3>
                <div className="text-3xl font-bold text-primary mb-1">₹3,50,000+</div>
                <div className="text-xs text-muted-foreground mb-4">Large / Regulated</div>
                <ul className="text-sm text-left space-y-2 mb-6 w-full">
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> Custom user limits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> Custom features
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-success">✔</span> Custom quote
                  </li>
                </ul>
                <button
                  onClick={() => handleSubscriptionSelect('CUSTOMIZED')}
                  className="mt-auto bg-gradient-to-r from-primary to-accent text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Signup Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-6" ref={formRef}>
          <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 border border-border">
            <Link
              href="/product"
              className="flex items-center gap-3 mb-6 group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-primary/20">
                <span className="text-primary-foreground font-heading font-bold text-xl">N</span>
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  NextGenTask
                </h2>
                <p className="text-xs font-caption text-accent font-semibold tracking-wide">
                  Manager
                </p>
              </div>
            </Link>
            <h3 className="text-xl font-bold mb-2">Sign Up</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Create your account to get started.
            </p>

            {status.type && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  status.type === 'success'
                    ? 'bg-success/10 border border-success/20 text-success'
                    : 'bg-destructive/10 border border-destructive/20 text-destructive'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                  required
                  disabled={isLoading}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                  required
                  disabled={isLoading}
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                name="organizationName"
                placeholder="Organization Name"
                value={formData.organizationName}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                name="pinCode"
                placeholder="Pin"
                value={formData.pinCode}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                name="contactNo"
                placeholder="Contact No"
                value={formData.contactNo}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                required
                disabled={isLoading}
              />
              <input
                type="number"
                name="teamSize"
                placeholder="Team Size"
                value={formData.teamSize || ''}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                required
                disabled={isLoading}
              />
              <select
                name="subscriptionType"
                value={formData.subscriptionType}
                onChange={handleInputChange}
                className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary/30 transition-smooth"
                required
                disabled={isLoading}
              >
                <option value="">Subscription Type</option>
                <option value="FREE">Free</option>
                <option value="BASIC">Basic</option>
                <option value="ENTERPRISE">Enterprise</option>
                <option value="CUSTOMIZED">Customized</option>
              </select>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <PublicFooter />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => router.push('/login')}
        title="Signup Successful!"
        subtitle="Welcome to NextGenTask Manager"
        message={successMessage}
        buttonText="Go to Login"
      />
    </div>
  );
}
