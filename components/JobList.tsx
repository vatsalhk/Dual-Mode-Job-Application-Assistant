import React from 'react';
import type { Job } from '../types';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface JobListProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

export const JobList: React.FC<JobListProps> = ({ jobs, onJobSelect }) => {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <MagicWandIcon className="h-8 w-8 text-sky-600" />
              <span className="ml-3 text-xl font-bold text-slate-800">Job Application Assistant</span>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800">Open Positions</h1>
        <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md border border-slate-200 p-6 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-xl">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">{job.title}</h2>
                <div className="mt-2 flex items-center text-slate-600">
                  <BriefcaseIcon className="w-5 h-5 mr-2" />
                  <span>{job.company}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{job.location}</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => onJobSelect(job)}
                  className="w-full bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-200"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
