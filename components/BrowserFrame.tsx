
import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';
import type { Job } from '../types';

interface BrowserFrameProps {
  children: React.ReactNode;
  onAutofillClick: () => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  job: Job;
  isEditingProfile?: boolean;
  isManagingPassword?: boolean;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({ children, onAutofillClick, scrollContainerRef, job, isEditingProfile, isManagingPassword }) => {
  const pageContent = React.Children.toArray(children)[0];
  const dropdown = React.Children.toArray(children)[1];

  let urlText = job.url;
  if (isEditingProfile) {
    urlText = 'extension://profile/edit';
  } else if (isManagingPassword) {
    urlText = 'extension://profile/password';
  }

  const showExtensionIcon = !isEditingProfile && !isManagingPassword;

  return (
    <div className="bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col h-[90vh] w-full max-w-7xl">
      {/* Browser Chrome Header */}
      <header className="flex-shrink-0 flex items-center p-3 border-b border-slate-200 bg-slate-50 rounded-t-lg relative z-10">
        {/* Window Controls */}
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        {/* Address Bar */}
        <div className="flex-grow mx-4">
          <div className="bg-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 text-center truncate">
            {urlText}
          </div>
        </div>
        {/* Extension Icon Container */}
        {showExtensionIcon && (
          <div className="flex-shrink-0 relative">
            <button 
              onClick={onAutofillClick} 
              className="p-1.5 rounded-full hover:bg-slate-200 transition-colors duration-200 animate-subtle-pulse"
              aria-label="Open Autofill options"
            >
              <MagicWandIcon className="w-6 h-6 text-sky-600" />
            </button>
            {dropdown}
          </div>
        )}
      </header>
      {/* Page Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {pageContent}
      </div>
    </div>
  );
};
