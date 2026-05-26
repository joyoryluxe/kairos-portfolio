'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import '../auth.css';

type ForgotStep = 'request' | 'reset' | 'done';

export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState<ForgotStep>('request');

  // Step 1: request
  const [email, setEmail] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [requestMsg, setRequestMsg] = useState('');

  // Step 2: reset
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError('');
    setRequestLoading(true);
    try {
      const msg = await forgotPassword(email);
      setRequestMsg(msg);
      setStep('reset');
    } catch (err: unknown) {
      setRequestError(err instanceof Error ? err.message : 'Request failed.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    if (newPassword !== confirmNew) {
      setResetError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters.');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setStep('done');
    } catch (err: unknown) {
      setResetError(err instanceof Error ? err.message : 'Reset failed.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <div className="auth-logo-text">
            <span className="auth-logo-brand">Kairos</span>
            <span className="auth-logo-sub">Admin Panel</span>
          </div>
        </div>

        <div className="auth-card">
          {step === 'request' && (
            <>
              <div className="auth-card-header">
                <div className="auth-card-icon">🔑</div>
                <h1>Forgot Password?</h1>
                <p>Enter your email and we&apos;ll generate a reset token for you</p>
              </div>

              {requestError && (
                <div className="auth-error">
                  <span className="auth-error-icon">⚠</span>
                  {requestError}
                </div>
              )}

              <form onSubmit={handleRequest} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="forgot-email">Email Address</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✉</span>
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="admin@kairosstudio.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`auth-btn-primary ${requestLoading ? 'loading' : ''}`}
                  disabled={requestLoading}
                >
                  {requestLoading ? (
                    <>
                      <span className="auth-spinner" />
                      Sending...
                    </>
                  ) : (
                    'Get Reset Token'
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'reset' && (
            <>
              <div className="auth-card-header">
                <div className="auth-card-icon">🔐</div>
                <h1>Reset Password</h1>
                <p>{requestMsg}</p>
              </div>

              {resetError && (
                <div className="auth-error">
                  <span className="auth-error-icon">⚠</span>
                  {resetError}
                </div>
              )}

              <form onSubmit={handleReset} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="reset-token">Reset Token</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🗝</span>
                    <input
                      id="reset-token"
                      type="text"
                      placeholder="Paste your reset token here"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="new-password">New Password</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔒</span>
                    <input
                      id="new-password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="auth-toggle-pass"
                      onClick={() => setShowPass(!showPass)}
                      aria-label="Toggle password visibility"
                    >
                      {showPass ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="confirm-new-password">Confirm New Password</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔐</span>
                    <input
                      id="confirm-new-password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Repeat your new password"
                      value={confirmNew}
                      onChange={(e) => setConfirmNew(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`auth-btn-primary ${resetLoading ? 'loading' : ''}`}
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <>
                      <span className="auth-spinner" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="auth-success">
              <div className="auth-success-icon">✅</div>
              <h2>Password Reset!</h2>
              <p>Your password has been updated. You are now signed in.</p>
              <Link href="/sections/" className="auth-btn-primary" style={{ display: 'flex', justifyContent: 'center' }}>
                Go to Dashboard
              </Link>
            </div>
          )}

          <div className="auth-divider">
            <span>Remember your password?</span>
          </div>

          <Link href="/auth/login" className="auth-btn-secondary">
            Back to Sign In
          </Link>
        </div>

        <p className="auth-footer">© 2024 Kairos Studio · All rights reserved</p>
      </div>
    </div>
  );
}
