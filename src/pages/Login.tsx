import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authService } from '../services/api';
import { LogIn, Key, Mail, ShieldAlert, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login: React.FC = () => {
  // Login standard states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Forgot Password interactive states
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [forgotEmailError, setForgotEmailError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
  const [resetting, setResetting] = useState(false);

  const { login } = useAuth();
  const { showToast, showModal } = useNotification();
  const navigate = useNavigate();

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateLoginForm = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setSubmitting(true);
    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (error: any) {
      showModal(
        'Sign In Failed',
        error.message || 'Incorrect email or password. Friendly reminder: register a new account on our signup page if you have not already!',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!forgotEmail.trim()) {
      setForgotEmailError('Email address is required');
      hasError = true;
    } else if (!emailRegex.test(forgotEmail)) {
      setForgotEmailError('Enter a valid email address');
      hasError = true;
    } else {
      setForgotEmailError('');
    }

    if (!newPassword) {
      setNewPasswordError('New password is required');
      hasError = true;
    } else if (newPassword.length < 6) {
      setNewPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setNewPasswordError('');
    }

    if (!confirmNewPassword) {
      setConfirmNewPasswordError('Please confirm the new password');
      hasError = true;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmNewPasswordError('');
    }

    if (hasError) return;

    setResetting(true);
    try {
      await authService.resetPassword(forgotEmail, newPassword);
      showModal(
        'Password Reset Successful',
        `Your password has been successfully updated on our local storage container. You can now use your new credentials to sign in immediately!`,
        'success',
        () => {
          setIsForgotPassword(false);
          setEmail(forgotEmail);
          setPassword('');
          // Clear forgot state
          setForgotEmail('');
          setNewPassword('');
          setConfirmNewPassword('');
        }
      );
    } catch (error: any) {
      showModal(
        'Password Reset Failed',
        error.message || 'We could not locate this email in our mock user register. Please ensure you type in a registered email address, or sign up for a new account.',
        'error'
      );
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Header Block toggles based on view mode */}
        <div className="text-center">
          <div className="inline-flex h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl items-center justify-center border border-emerald-100 shadow-xs mb-3">
            {isForgotPassword ? <Key className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isForgotPassword ? 'Reset Password' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {isForgotPassword 
              ? 'Enter your registered email below to update your password.' 
              : 'Sign in to start posting and fulfilling request slots.'}
          </p>
        </div>

        {/* Form Card */}
        <Card>
          {!isForgotPassword ? (
            /* SIGN IN FORM VIEW */
            <form onSubmit={handleSignInSubmit} className="space-y-5" noValidate>
              
              {/* Email Field */}
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="rachel@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                error={emailError}
                disabled={submitting}
                autoComplete="email"
                required
              />

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">Password</span>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  label=""
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  error={passwordError}
                  disabled={submitting}
                  autoComplete="current-password"
                  required
                />
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={submitting}
                    className="rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Quick Helper hint block */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-150/45 text-xs text-amber-900 leading-relaxed shadow-xs">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Since the Phase 2 community system runs a simulated local storage database in your browser, you must first click the <strong>Register</strong> tab at the bottom to sign up an account to simulate logging in.
                </span>
              </div>

              {/* Sign in submission button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold"
                isLoading={submitting}
              >
                Sign In
              </Button>

            </form>
          ) : (
            /* STATEFUL PASSWORD RESET FORM VIEW */
            <form onSubmit={handleResetPasswordSubmit} className="space-y-4" noValidate>
              
              {/* Back to Sign In Link Button */}
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setForgotEmailError('');
                  setNewPasswordError('');
                  setConfirmNewPasswordError('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer mb-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Sign In</span>
              </button>

              {/* Registered Email */}
              <Input
                id="forgotEmail"
                label="Registered Email Address"
                type="email"
                placeholder="e.g. rachel@example.com"
                value={forgotEmail}
                onChange={(e) => {
                  setForgotEmail(e.target.value);
                  if (forgotEmailError) setForgotEmailError('');
                }}
                error={forgotEmailError}
                disabled={resetting}
                autoComplete="email"
                required
              />

              {/* New Password */}
              <div className="relative">
                <Input
                  id="newPassword"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (newPasswordError) setNewPasswordError('');
                  }}
                  error={newPasswordError}
                  disabled={resetting}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Confirm New Password */}
              <Input
                id="confirmNewPassword"
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  if (confirmNewPasswordError) setConfirmNewPasswordError('');
                }}
                error={confirmNewPasswordError}
                disabled={resetting}
                autoComplete="new-password"
                required
              />

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/70 border border-emerald-100/30 text-xs text-slate-600">
                <ShieldAlert className="h-4.5 w-4.5 text-emerald-650 shrink-0 mt-0.5" />
                <span>
                  <strong>Local Verification:</strong> Submitting this form resets the password associated with this email address inside the simulated mock-database locally.
                </span>
              </div>

              {/* Reset Password Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2 font-bold"
                isLoading={resetting}
              >
                Reset Password
              </Button>
            </form>
          )}

          {/* Footer redirection links */}
          <div className="mt-6 text-center text-sm border-t border-slate-100 pt-4">
            <span className="text-slate-500">New to Community Help? </span>
            <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Login;
