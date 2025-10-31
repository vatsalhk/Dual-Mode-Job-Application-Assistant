

import React, { useState, useEffect, useRef } from 'react';
import type { ProfileData, WorkExperience, Education } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { PlusIcon } from './icons/PlusIcon';
import { XIcon } from './icons/XIcon';

interface GuidedApplySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  activeField: string | null;
  onFieldFill: (field: string, value: string) => void;
  onSelectiveFill: (value: string) => void;
  onFillAllSkills: () => void;
  onAddSkill: (skill: string) => void;
  onAddWorkExperienceBlock: (workExperience: WorkExperience) => void;
  onAddEducationBlock: (education: Education) => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; isHighlighted: boolean, sectionId: string }> = ({ title, icon, children, isHighlighted, sectionId }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div data-section={sectionId} className={`border-b border-slate-700/50 transition-all duration-300 ${isHighlighted ? 'bg-sky-500/10 ring-2 ring-sky-400 rounded-lg' : ''}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 text-left rounded-lg hover:bg-slate-700/50 transition-colors">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-3 font-semibold text-slate-200">{title}</h3>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
      </button>
      {isOpen && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
};

const DataRow: React.FC<{ label: string; value: string | undefined; onFill: () => void }> = ({ label, value, onFill }) => {
  if (!value) return null;
  return (
    <div className="text-sm py-2 group">
      <div className="text-slate-400">{label}</div>
      <div className="text-slate-200 flex justify-between items-center">
        <span>{value}</span>
        <button onClick={onFill} className="opacity-0 group-hover:opacity-100 transition-opacity bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 p-1 rounded-full">
            <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


export const GuidedApplySidebar: React.FC<GuidedApplySidebarProps> = ({ isOpen, onClose, profileData, activeField, onFieldFill, onSelectiveFill, onFillAllSkills, onAddSkill, onAddWorkExperienceBlock, onAddEducationBlock }) => {
  const { contact, workExperience, education, skills } = profileData;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeField && scrollContainerRef.current) {
      const sectionElement = scrollContainerRef.current.querySelector(`[data-section="${activeField}"]`);
      if (sectionElement) {
        sectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [activeField]);

  return (
    <aside className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-slate-800 text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-30 flex flex-col`}>
      <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Guided Apply</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700 transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <Section title="Contact Info" icon={<UserIcon className="w-5 h-5 text-slate-400" />} isHighlighted={activeField === 'contact'} sectionId="contact">
           <DataRow label="First Name" value={contact.firstName} onFill={() => onFieldFill('firstName', contact.firstName)} />
           <DataRow label="Last Name" value={contact.lastName} onFill={() => onFieldFill('lastName', contact.lastName)} />
           <DataRow label="Email" value={contact.email} onFill={() => onFieldFill('email', contact.email)} />
           <DataRow label="Phone" value={contact.phone} onFill={() => onFieldFill('phone', contact.phone)} />
           <DataRow label="LinkedIn" value={contact.linkedin} onFill={() => onFieldFill('linkedin', contact.linkedin || '')} />
           <DataRow label="Portfolio" value={contact.portfolio} onFill={() => onFieldFill('portfolio', contact.portfolio || '')} />
        </Section>
        
        <Section title="Work Experience" icon={<BriefcaseIcon className="w-5 h-5 text-slate-400" />} isHighlighted={activeField === 'workExperience'} sectionId="workExperience">
            {workExperience.map((job, index) => (
                <div key={index} className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold text-sky-300">{job.title}</p>
                        <p className="text-sm text-slate-300">{job.company}</p>
                      </div>
                       <button
                          onClick={() => onAddWorkExperienceBlock(job)}
                          className="p-1 rounded-full text-sky-300 bg-sky-500/20 hover:bg-sky-500/40 transition-colors"
                          aria-label={`Add work experience: ${job.title} at ${job.company}`}
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mt-2 text-sm space-y-2">
                        <DataRow label="Title" value={job.title} onFill={() => onFieldFill('title', job.title)} />
                        <DataRow label="Company" value={job.company} onFill={() => onFieldFill('company', job.company)} />
                        <DataRow label="Location" value={job.location} onFill={() => onFieldFill('location', job.location)} />
                        <DataRow label="Start Date" value={job.startDate} onFill={() => onFieldFill('startDate', job.startDate)} />
                        <DataRow label="End Date" value={job.endDate} onFill={() => onFieldFill('endDate', job.endDate)} />
                    </div>
                    <div className="mt-3">
                        <p className="text-slate-400 text-sm">Responsibilities:</p>
                        <ul className="mt-1 space-y-1">
                            {job.responsibilities.map((resp, i) => (
                                <li key={i} className="text-slate-300 text-sm flex items-start group">
                                    <span className="mr-2 mt-1">-</span>
                                    <span className="flex-1">{resp}</span>
                                    <button onClick={() => onSelectiveFill(resp)} className="opacity-0 group-hover:opacity-100 transition-opacity bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 p-1 rounded-full ml-2">
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </Section>
        
        <Section title="Education" icon={<AcademicCapIcon className="w-5 h-5 text-slate-400" />} isHighlighted={activeField === 'education'} sectionId="education">
            {education.map((edu, index) => (
                <div key={index} className="mb-2 p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-semibold text-sky-300">{edu.degree}</p>
                        <p className="text-sm text-slate-300">{edu.institution}</p>
                      </div>
                      <button
                        onClick={() => onAddEducationBlock(edu)}
                        className="p-1 rounded-full text-sky-300 bg-sky-500/20 hover:bg-sky-500/40 transition-colors"
                        aria-label={`Add education: ${edu.degree} from ${edu.institution}`}
                      >
                        <PlusIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-2 text-sm space-y-2">
                      <DataRow label="Institution" value={edu.institution} onFill={() => onFieldFill('institution', edu.institution)} />
                      <DataRow label="Degree" value={edu.degree} onFill={() => onFieldFill('degree', edu.degree)} />
                      <DataRow label="Field of Study" value={edu.fieldOfStudy} onFill={() => onFieldFill('fieldOfStudy', edu.fieldOfStudy)} />
                      <DataRow label="Graduation Date" value={edu.graduationDate} onFill={() => onFieldFill('graduationDate', edu.graduationDate)} />
                    </div>
                </div>
            ))}
        </Section>

        <Section title="Skills" icon={<SparklesIcon className="w-5 h-5 text-slate-400" />} isHighlighted={activeField === 'skills'} sectionId="skills">
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <div key={index} className="group flex items-center bg-sky-500/20 text-sky-300 text-xs font-medium rounded-full transition-colors hover:bg-sky-500/30">
                        <span className="pl-2.5 py-1">{skill}</span>
                        <button
                            onClick={() => onAddSkill(skill)}
                            className="ml-1 mr-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-sky-500/50 transition-opacity"
                            aria-label={`Add skill: ${skill}`}
                        >
                            <PlusIcon className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <button
                    onClick={onFillAllSkills}
                    className="w-full flex items-center justify-center text-sm font-semibold text-sky-300 hover:text-sky-200 bg-sky-500/20 hover:bg-sky-500/30 transition-colors p-2 rounded-lg"
                >
                    <PlusIcon className="w-4 h-4 mr-2" /> Fill All Skills
                </button>
            </div>
        </Section>
      </div>
    </aside>
  );
};