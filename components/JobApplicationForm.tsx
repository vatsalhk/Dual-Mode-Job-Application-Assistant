import React, { useEffect, useRef } from 'react';
import type { JobApplicationData, WorkExperience, Education, Job } from '../types';
import { UserIcon } from './icons/UserIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UploadIcon } from './icons/UploadIcon';


interface JobApplicationFormProps {
  job: Job;
  formData: JobApplicationData;
  setFormData: React.Dispatch<React.SetStateAction<JobApplicationData>>;
  setActiveField: (field: string | null) => void;
  onGoBack: () => void;
  onSkillsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  scrollToId: string | null;
  onScrollComplete: () => void;
  isEditingProfile?: boolean;
  onSubmit: () => void;
  onParseResume?: (file: File) => Promise<void>;
  isParsing?: boolean;
  parseError?: string | null;
  hasUnsavedChangesFromUpload?: boolean;
}

const FormField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFocus: () => void;
  type?: string;
  rows?: number;
}> = ({ id, label, value, onChange, onFocus, type = "text", rows }) => {
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      <InputComponent
        id={id}
        name={id}
        type={type}
        rows={rows}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
      />
    </div>
  );
};

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, formData, setFormData, setActiveField, onGoBack, onSkillsChange, scrollToId, onScrollComplete, isEditingProfile, onSubmit, onParseResume, isParsing, parseError, hasUnsavedChangesFromUpload }) => {
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollToId) {
            const element = document.getElementById(scrollToId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                const animationClass = 'animate-highlight-scroll';
                const parentCard = element.closest('.p-4.border'); // Target the card for better visibility
                const targetElement = parentCard || element;

                targetElement.classList.add(animationClass);
                
                const timer = setTimeout(() => {
                    targetElement.classList.remove(animationClass);
                    onScrollComplete();
                }, 1500); // Corresponds to the animation duration

                return () => clearTimeout(timer);
            } else {
                // If element not found immediately, it might not have rendered yet
                onScrollComplete();
            }
        }
    }, [scrollToId, onScrollComplete]);

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleWorkExperienceChange = (index: number, field: keyof WorkExperience, value: string | string[]) => {
        setFormData(prev => {
            const newWorkExperience = [...prev.workExperience];
            newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
            return { ...prev, workExperience: newWorkExperience };
        });
    };

    const addWorkExperience = () => {
        setFormData(prev => ({
            ...prev,
            workExperience: [...prev.workExperience, { title: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [] }]
        }));
    };

    const removeWorkExperience = (index: number) => {
        setFormData(prev => ({
            ...prev,
            workExperience: prev.workExperience.filter((_, i) => i !== index)
        }));
    };

    const handleEducationChange = (index: number, field: keyof Education, value: string) => {
        setFormData(prev => {
            const newEducation = [...prev.education];
            newEducation[index] = { ...newEducation[index], [field]: value };
            return { ...prev, education: newEducation };
        });
    };
    
    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { institution: '', degree: '', fieldOfStudy: '', graduationDate: '' }]
        }));
    };

    const removeEducation = (index: number) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !onParseResume) return;
        await onParseResume(file);
        if (event.target) {
            event.target.value = '';
        }
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-4 sm:p-8 lg:p-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">{isEditingProfile ? 'Edit Your Profile' : `Apply for ${job.title}`}</h1>
                <p className="text-slate-500 mt-1">{isEditingProfile ? 'This information is saved locally and used for all applications.' : `at ${job.company}`}</p>
            </div>
            
            {isEditingProfile && (
              <div className="mt-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-semibold text-slate-700">Update from Resume</h3>
                        <p className="text-sm text-slate-500 mt-1">Upload a new resume to automatically fill your profile.</p>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        disabled={isParsing}
                    />
                    <button
                        onClick={handleUploadClick}
                        disabled={isParsing}
                        className="w-full sm:w-auto flex-shrink-0 bg-white text-slate-700 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-slate-100 border border-slate-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isParsing ? (
                             <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Parsing...
                            </div>
                        ) : (
                            <>
                                <UploadIcon className="w-5 h-5 mr-2" />
                                Upload New Resume
                            </>
                        )}
                    </button>
                </div>
                 {parseError && <p className="mt-3 text-sm text-red-600 bg-red-100 p-2 rounded-md">{parseError}</p>}
                 {hasUnsavedChangesFromUpload && !isParsing && (
                    <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
                        <p className="text-sm font-medium text-sky-800 text-center sm:text-left">
                            Your profile has been updated. Save the changes or cancel to discard changes.
                        </p>
                        <div className="flex-shrink-0 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onGoBack}
                            className="bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-slate-200 border border-slate-300 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button onClick={onSubmit} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200">
                            Save Profile
                        </button>
                        </div>
                    </div>
                )}
              </div>
            )}

            <div className="mt-8 space-y-6">
                {/* Personal Information Section */}
                <div id="personal-info-section" className="border-t border-slate-200 pt-6">
                    <h2 className="text-lg font-semibold text-slate-700 flex items-center"><UserIcon className="w-5 h-5 mr-2 text-slate-500"/> Personal Information</h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField id="firstName" label="First Name" value={formData.firstName} onChange={handleContactChange} onFocus={() => setActiveField('contact')}/>
                        <FormField id="lastName" label="Last Name" value={formData.lastName} onChange={handleContactChange} onFocus={() => setActiveField('contact')}/>
                        <FormField id="email" label="Email" value={formData.email} onChange={handleContactChange} onFocus={() => setActiveField('contact')} type="email"/>
                        <FormField id="phone" label="Phone" value={formData.phone} onChange={handleContactChange} onFocus={() => setActiveField('contact')} type="tel"/>
                        <FormField id="linkedin" label="LinkedIn Profile" value={formData.linkedin} onChange={handleContactChange} onFocus={() => setActiveField('contact')}/>
                        <FormField id="portfolio" label="Portfolio URL" value={formData.portfolio} onChange={handleContactChange} onFocus={() => setActiveField('contact')}/>
                    </div>
                </div>

                {/* Work Experience Section */}
                <div className="border-t border-slate-200 pt-6">
                    <h2 className="text-lg font-semibold text-slate-700 flex items-center"><BriefcaseIcon className="w-5 h-5 mr-2 text-slate-500"/>Work Experience</h2>
                    <div className="mt-4 space-y-8">
                        {formData.workExperience.map((job, index) => (
                            <div key={index} id={`work-experience-card-${index}`} className="p-4 border border-slate-300 rounded-lg relative bg-slate-50/50">
                                <h3 className="font-semibold text-slate-600 mb-4">Position {index + 1}</h3>
                                <button onClick={() => removeWorkExperience(index)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField id={`work-${index}-title`} label="Job Title" value={job.title} onChange={(e) => handleWorkExperienceChange(index, 'title', e.target.value)} onFocus={() => setActiveField('workExperience')}/>
                                    <FormField id={`work-${index}-company`} label="Company" value={job.company} onChange={(e) => handleWorkExperienceChange(index, 'company', e.target.value)} onFocus={() => setActiveField('workExperience')}/>
                                    <FormField id={`work-${index}-location`} label="Location" value={job.location} onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)} onFocus={() => setActiveField('workExperience')}/>
                                    <div/>
                                    <FormField id={`work-${index}-startDate`} label="Start Date" value={job.startDate} onChange={(e) => handleWorkExperienceChange(index, 'startDate', e.target.value)} onFocus={() => setActiveField('workExperience')}/>
                                    <FormField id={`work-${index}-endDate`} label="End Date" value={job.endDate} onChange={(e) => handleWorkExperienceChange(index, 'endDate', e.target.value)} onFocus={() => setActiveField('workExperience')}/>
                                </div>
                                <div className="mt-6">
                                      <FormField id={`work-${index}-responsibilities`} label="Responsibilities" value={job.responsibilities.join('\n')} onChange={(e) => handleWorkExperienceChange(index, 'responsibilities', e.target.value.split('\n'))} onFocus={() => setActiveField('workExperience')} type="textarea" rows={6}/>
                                </div>
                            </div>
                        ))}
                    </div>
                     <button onClick={addWorkExperience} className="mt-4 flex items-center text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors">
                        <PlusIcon className="w-5 h-5 mr-1"/> Add Work Experience
                    </button>
                </div>

                {/* Education Section */}
                <div className="border-t border-slate-200 pt-6">
                    <h2 className="text-lg font-semibold text-slate-700 flex items-center"><AcademicCapIcon className="w-5 h-5 mr-2 text-slate-500"/>Education</h2>
                     <div className="mt-4 space-y-8">
                        {formData.education.map((edu, index) => (
                             <div key={index} id={`education-card-${index}`} className="p-4 border border-slate-300 rounded-lg relative bg-slate-50/50">
                                <h3 className="font-semibold text-slate-600 mb-4">Entry {index + 1}</h3>
                                <button onClick={() => removeEducation(index)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField id={`edu-${index}-institution`} label="Institution" value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} onFocus={() => setActiveField('education')}/>
                                    <FormField id={`edu-${index}-degree`} label="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} onFocus={() => setActiveField('education')}/>
                                    <FormField id={`edu-${index}-fieldOfStudy`} label="Field of Study" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)} onFocus={() => setActiveField('education')}/>
                                    <FormField id={`edu-${index}-graduationDate`} label="Graduation Date" value={edu.graduationDate} onChange={(e) => handleEducationChange(index, 'graduationDate', e.target.value)} onFocus={() => setActiveField('education')}/>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={addEducation} className="mt-4 flex items-center text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors">
                        <PlusIcon className="w-5 h-5 mr-1"/> Add Education
                    </button>
                </div>

                {/* Skills Section */}
                <div className="border-t border-slate-200 pt-6">
                    <h2 className="text-lg font-semibold text-slate-700 flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-slate-500"/>Skills</h2>
                    <div className="mt-4">
                        <FormField
                            id="skills"
                            label="Skills (comma-separated)"
                            value={formData.skills ? formData.skills.join(', ') : ''}
                            onChange={onSkillsChange}
                            onFocus={() => setActiveField('skills')}
                            type="textarea"
                            rows={4}
                        />
                    </div>
                </div>

            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end items-center gap-4">
                 <button
                    type="button"
                    onClick={onGoBack}
                    className="bg-slate-100 text-slate-700 font-bold py-3 px-8 rounded-lg shadow-sm hover:bg-slate-200 border border-slate-300 transition-colors duration-200"
                >
                    Back
                </button>
                <button onClick={onSubmit} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200">
                    {isEditingProfile ? 'Save Profile' : 'Submit Application'}
                </button>
            </div>
        </div>
    );
};