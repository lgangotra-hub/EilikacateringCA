import React, { useState } from 'react';
import { ShieldCheck, Key, Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import { ThemeConfig } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  correctPassword: string;
  theme: ThemeConfig;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  correctPassword,
  theme,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === correctPassword) {
      setErrorMsg('');
      setPasswordInput('');
      onLoginSuccess();
    } else {
      setErrorMsg('Incorrect admin password. Default password is: admin 123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md ${theme.cardBg} ${theme.glassBlur} ${theme.cardBorder} rounded-3xl p-6 md:p-8 shadow-2xl border relative`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-black text-xl text-stone-900 dark:text-stone-50">
            Admin Authentication
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Enter the admin password to manage products, categories, themes & GitHub API.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter password (default: admin 123)"
                autoFocus
                className="w-full pl-10 pr-10 py-3 rounded-xl text-sm bg-black/5 dark:bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
              <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Hint: default password is <code className="font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">admin 123</code>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-stone-700 dark:text-stone-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              id="btn-admin-submit-login"
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
            >
              Enter Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
