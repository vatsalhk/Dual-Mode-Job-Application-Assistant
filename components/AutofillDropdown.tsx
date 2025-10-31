
import React, { useEffect, useRef } from 'react';
import { XIcon } from './icons/XIcon';
import { LightningBoltIcon } from './icons/LightningBoltIcon';
import { TargetIcon } from './icons/TargetIcon';
import { PencilIcon } from './icons/PencilIcon';
import { OnboardingInDropdown } from './OnboardingInDropdown';
import type { ProfileData } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { KeyIcon } from './icons/KeyIcon';

interface AutofillDropdownProps {
  isVisible: boolean;
  onClose: () => void;
  onQuickApply: () => void;
  onGuidedApply: () => void;
  onEditProfile: () => void;
  onManagePassword: () => void;
  profileData: ProfileData | null;
  onProfileCreate: (data: ProfileData, password?: string) => void;
  parseResume: (file: File) => Promise<ProfileData>;
  view: 'options' | 'success';
}

export const AutofillDropdown: React.FC<AutofillDropdownProps> = ({ isVisible, onClose, onQuickApply, onGuidedApply, onEditProfile, onManagePassword, profileData, onProfileCreate, parseResume, view }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // If the click is inside the password modal, don't close the dropdown.
      if (target.closest('.password-modal-root')) {
          return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 rounded-lg shadow-2xl z-50 border animate-fade-in transition-all duration-300 bg-slate-900 p-8 w-[480px] border-slate-700"
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        aria-label="Close modal"
      >
        <XIcon className="w-6 h-6" />
      </button>

      {!profileData ? (
        <OnboardingInDropdown onProfileCreate={onProfileCreate} parseResume={parseResume} />
      ) : view === 'success' ? (
        <div className="flex flex-col items-center justify-center text-center animate-fade-in py-10">
            <div className="bg-green-500/20 rounded-full p-4 transform scale-150">
                <CheckIcon className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-white">Applied Successfully!</h2>
            <p className="mt-1 text-slate-300">Your information has been filled.</p>
        </div>
      ) : (
        <div className="text-white">
          <h2 className="text-xl font-bold">Choose Your Mode</h2>
          <p className="text-slate-400 mt-1">How would you like to fill this application?</p>

          <div className="mt-6 space-y-4">
            {/* Quick Apply Button */}
            <button 
              onClick={onQuickApply} 
              className="w-full text-left p-4 border-2 border-indigo-500/50 rounded-lg flex items-center bg-slate-800/30 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
            >
              <div className="flex-shrink-0 bg-indigo-500/10 p-3 rounded-full mr-4">
                  <LightningBoltIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold text-indigo-400">Quick Apply</p>
                <p className="text-sm text-slate-400">One-click autofill for speed. Perfect for bulk applications.</p>
              </div>
            </button>

            {/* Guided Apply Button */}
            <button 
              onClick={onGuidedApply} 
              className="w-full text-left p-4 border-2 border-purple-500/50 rounded-lg flex items-center bg-slate-800/30 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
            >
              <div className="flex-shrink-0 bg-purple-500/10 p-3 rounded-full mr-4">
                  <TargetIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-purple-400">Guided Apply</p>
                <p className="text-sm text-slate-400">Step-by-step control. Perfect for dream jobs.</p>
              </div>
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700 space-y-1">
            <button
              onClick={onEditProfile}
              className="w-full text-left p-3 rounded-lg flex items-center text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
            >
                <PencilIcon className="w-5 h-5 mr-3 text-slate-400" />
                <span className="font-medium">Edit Profile Data</span>
            </button>
            <button
              onClick={onManagePassword}
              className="w-full text-left p-3 rounded-lg flex items-center text-slate-300 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200"
            >
                <KeyIcon className="w-5 h-5 mr-3 text-slate-400" />
                <span className="font-medium">Manage Password</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
