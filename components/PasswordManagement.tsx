
import React, { useState } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface PasswordManagementProps {
  currentPassword: string | null;
  onSave: (newPassword: string | null) => void;
  onCancel: () => void;
}

const FormField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  autoFocus?: boolean;
}> = ({ id, label, value, onChange, type = "password", placeholder, autoFocus }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
    />
  </div>
);

export const PasswordManagement: React.FC<PasswordManagementProps> = ({ currentPassword, onSave, onCancel }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRemoveSuccess, setIsRemoveSuccess] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  const isActionInProgress = isRemoveSuccess || isUpdateSuccess;

  const handleSavePassword = () => {
    setError(null);
    if (!newPassword) {
      setError('Password cannot be empty.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsUpdateSuccess(true);
    setTimeout(() => {
        onSave(newPassword);
    }, 1500);
  };

  const handleRemovePassword = () => {
    if (window.confirm('Are you sure you want to remove your password? Your profile will no longer be protected.')) {
      setIsRemoveSuccess(true);
      setTimeout(() => {
        onSave(null);
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSavePassword();
  }

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Manage Your Password</h1>
        <p className="text-slate-500 mt-1">
          {currentPassword ? 'Change or remove your profile password.' : 'Add a password to protect your profile.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto">
        <div className="space-y-6 border border-slate-200 rounded-lg p-6 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center">
            <KeyIcon className="w-5 h-5 mr-2 text-slate-500" />
            Password Settings
          </h2>
          
          {isUpdateSuccess ? (
             <div className="flex items-center justify-center text-green-600 font-bold py-10 animate-fade-in">
                <CheckIcon className="w-6 h-6 mr-2" />
                <span>Password Saved!</span>
            </div>
          ) : (
            <>
              <FormField
                id="newPassword"
                label={currentPassword ? "New Password" : "Password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoFocus={true}
              />
              <FormField
                id="confirmNewPassword"
                label={currentPassword ? "Confirm New Password" : "Confirm Password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </>
          )}

          {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center">{error}</p>}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-4">
          {currentPassword && (
             <div className="w-full sm:w-auto sm:mr-auto">
              {isRemoveSuccess ? (
                <div className="flex items-center justify-center text-green-600 font-bold py-3 px-6 animate-fade-in">
                  <CheckIcon className="w-5 h-5 mr-2" />
                  <span>Password Removed</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRemovePassword}
                  disabled={isActionInProgress}
                  className="w-full sm:w-auto text-red-600 font-bold py-3 px-6 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                >
                  Remove Password
                </button>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={onCancel}
            disabled={isActionInProgress}
            className="w-full sm:w-auto bg-slate-100 text-slate-700 font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-slate-200 border border-slate-300 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isActionInProgress}
            className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
