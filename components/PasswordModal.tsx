import React, { useState, useEffect } from 'react';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { XIcon } from './icons/XIcon';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  error: string | null;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit, error }) => {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPassword(''); // Clear password on open
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 flex items-center justify-center z-50 animate-fade-in password-modal-root" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-sm border border-slate-700 relative text-white" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-700">
                <LockClosedIcon className="h-6 w-6 text-sky-400" />
            </div>
            <h2 className="text-xl font-bold mt-4">Profile Locked</h2>
            <p className="mt-1 text-slate-400 text-sm">Please enter your password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
            <div>
                <label htmlFor="password-modal-input" className="sr-only">Password</label>
                <input
                    id="password-modal-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="Password"
                    autoFocus
                />
            </div>

            {error && <p className="mt-2 text-sm text-red-400 text-center">{error}</p>}

            <div className="mt-6 flex gap-4">
                 <button
                    type="button"
                    onClick={onClose}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    disabled={!password}
                >
                    Unlock
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};