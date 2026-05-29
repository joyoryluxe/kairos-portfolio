'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import '../auth.css';

export default function ForgotPasswordPage() {
  const { updatePassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    try {
      const msg = await updatePassword(email, oldPassword, newPassword);
      setSuccess(msg);
      // Clear fields on success
      setOldPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setLoading(false);
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
          <div className="auth-card-header">
            <div className="auth-card-icon">🔑</div>
            <h1>Update Password</h1>
            <p>Enter your email, old password, and new password</p>
          </div>

          {error && (
            <div className="auth-error">
              <span className="auth-error-icon">⚠</span>
              {error}
            </div>
          )}
          
          {success && (
            <div className="auth-success">
              <div className="auth-success-icon">✅</div>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleUpdate} className="auth-form">
            <div className="auth-field">
              <label htmlFor="update-email">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input
                  id="update-email"
                  type="email"
                  placeholder="admin@kairosstudio.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="old-password">Old Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔓</span>
                <input
                  id="old-password"
                  type={showOldPass ? 'text' : 'password'}
                  placeholder="Enter old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-pass"
                  onClick={() => setShowOldPass(!showOldPass)}
                  aria-label="Toggle password visibility"
                >
                  {showOldPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="new-password">New Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  id="new-password"
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-toggle-pass"
                  onClick={() => setShowNewPass(!showNewPass)}
                  aria-label="Toggle password visibility"
                >
                  {showNewPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`auth-btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Ready to login?</span>
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
