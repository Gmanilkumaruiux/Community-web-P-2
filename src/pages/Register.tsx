import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ShieldCheck, UserPlus, Eye, EyeOff } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const { showToast, showModal } = useNotification();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear errors as user typing
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[0-9\s\-()]{10,18}$/;

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Full name must be at least 3 characters long';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.mobile.trim())) {
      errors.mobile = 'Enter a valid 10-15 digit mobile number';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.mobile);
      
      // Global Success Modal feedback as requested: "Modal Component for handling success and error feedback across the entire application."
      showModal(
        'Registration Successful!',
        `Welcome to Community Help, ${formData.name}. Your account has been initialized on our Phase 2 community prototype with local data persistence and you are now securely logged in. Let's head over to your community dashboard.`,
        'success',
        () => navigate('/dashboard')
      );
    } catch (error: any) {
      // Error handling modal as requested
      showModal(
        'Registration Failed',
        error.message || 'An error occurred during registration. Please double check details.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Registration Header Badge */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl items-center justify-center border border-emerald-100 shadow-xs mb-3">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Join local neighborhood coordinators to declare aid slots.
          </p>
        </div>

        {/* Register Card wrapper */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Full Name */}
            <Input
              id="name"
              label="Full Name"
              type="text"
              placeholder="e.g. Rachel Green"
              value={formData.name}
              onChange={handleInputChange}
              error={formErrors.name}
              disabled={submitting}
              autoComplete="name"
              required
            />

            {/* Email Address */}
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="rachel@example.com"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              disabled={submitting}
              autoComplete="email"
              required
            />

            {/* Mobile Number */}
            <Input
              id="mobile"
              label="Mobile Number"
              type="tel"
              placeholder="e.g. +1 (555) 019-2834"
              value={formData.mobile}
              onChange={handleInputChange}
              error={formErrors.mobile}
              disabled={submitting}
              autoComplete="tel"
              required
            />

            {/* Password */}
            <div className="relative">
              <Input
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                error={formErrors.password}
                disabled={submitting}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={formErrors.confirmPassword}
              disabled={submitting}
              autoComplete="new-password"
              required
            />

            {/* Privacy indicator */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100/40 text-xs text-slate-600 mt-2">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                By creating an account, your details are held on an encrypted local container to verify coordinator transactions. Read our Privacy Policy.
              </span>
            </div>

            {/* Submit Block */}
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 font-bold"
              isLoading={submitting}
            >
              Sign Up
            </Button>
          </form>

          {/* Card Alternative Footer */}
          <div className="mt-6 text-center text-sm border-t border-slate-100 pt-4">
            <span className="text-slate-500">Already registered? </span>
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
              Sign In Instead
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Register;
