import React, { useState, useRef, useEffect } from 'react';
import type { ProfileData } from '../types';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { CheckIcon } from './icons/CheckIcon';

interface OnboardingInDropdownProps {
  onProfileCreate: (data: ProfileData, password?: string) => void;
  parseResume: (file: File) => Promise<ProfileData>;
}

export const OnboardingInDropdown: React.FC<OnboardingInDropdownProps> = ({ onProfileCreate, parseResume }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwordPreference, setPasswordPreference] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUploadDisabled, setIsUploadDisabled] = useState(true);

  useEffect(() => {
    if (passwordPreference === 'no') {
        setIsUploadDisabled(false);
    } else if (passwordPreference === 'yes') {
        if (password.length > 0 && password === confirmPassword) {
            setIsUploadDisabled(false);
        } else {
            setIsUploadDisabled(true);
        }
    } else {
        setIsUploadDisabled(true);
    }
  }, [passwordPreference, password, confirmPassword]);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const profileData = await parseResume(file);
      setIsSuccess(true);
      setTimeout(() => {
        onProfileCreate(profileData, passwordPreference === 'yes' ? password : undefined);
      }, 1500); // Show success for 1.5s before transitioning
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="font-sans">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in py-10">
            <div className="bg-green-500/20 rounded-full p-4 transform scale-150">
                <CheckIcon className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-white">Profile Created!</h2>
            <p className="mt-1 text-slate-300">Redirecting...</p>
        </div>
      ) : (
        <>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-sky-400">Job Application Assistant</h1>
                <p className="mt-4 text-base text-slate-300">
                    Create your secure, local profile once. Apply everywhere with speed and precision.
                </p>
                 <p className="mt-2 text-xs text-slate-500">
                    Your data is yours. All profiles are stored locally on your computer, not on our servers.
                </p>
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-slate-300 font-medium mb-3 text-sm">Protect your profile with an optional password?</p>
                <div className="flex justify-center gap-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="passwordPreference" 
                            value="yes" 
                            checked={passwordPreference === 'yes'}
                            onChange={(e) => setPasswordPreference(e.target.value)}
                            className="form-radio h-4 w-4 text-sky-500 bg-slate-800 border-slate-600 focus:ring-sky-500" 
                        />
                        <span className="text-slate-300 text-sm">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="passwordPreference" 
                            value="no" 
                            checked={passwordPreference === 'no'}
                            onChange={(e) => setPasswordPreference(e.target.value)}
                            className="form-radio h-4 w-4 text-sky-500 bg-slate-800 border-slate-600 focus:ring-sky-500"
                        />
                        <span className="text-slate-300 text-sm">No</span>
                    </label>
                </div>
            </div>

            {passwordPreference === 'yes' && (
                <div className="mt-3 space-y-3 animate-fade-in">
                    <div>
                        <input 
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-sm bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                    </div>
                    <div>
                        <input 
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full text-sm bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                        <p className="text-xs text-red-500 text-center">Passwords do not match.</p>
                    )}
                </div>
            )}

            <div className="mt-8">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
                <button
                    onClick={handleUploadClick}
                    disabled={isLoading || isUploadDisabled}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Parsing Resume...
                        </div>
                    ) : (
                        <div className="flex items-center">
                          <MagicWandIcon className="w-5 h-5 mr-2" />
                            Start by Uploading Your Resume
                        </div>
                    )}
                </button>
                <p className="text-center text-xs text-slate-500 mt-2">(.pdf or .docx files)</p>
            </div>

            {error && <p className="mt-3 text-center text-sm text-red-400 bg-red-500/20 p-2 rounded-lg">{error}</p>}

            <p className="text-center text-sm text-slate-500 mt-6">
                After uploading, your profile will be ready for "Quick Apply" and "Guided Apply" modes.
            </p>
        </>
      )}
    </div>
  );
};