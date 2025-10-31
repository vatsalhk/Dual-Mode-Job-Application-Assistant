
import React, { useState, useCallback } from 'react';
import { JobApplicationForm } from './components/JobApplicationForm';
import { GuidedApplySidebar } from './components/GuidedApplySidebar';
import { BrowserFrame } from './components/BrowserFrame';
import { AutofillDropdown } from './components/AutofillDropdown';
import type { ProfileData, JobApplicationData, WorkExperience, Education, Job } from './types';
import { parseResume } from './services/geminiService';
import { JobList } from './components/JobList';
import { PasswordModal } from './components/PasswordModal';
import { PasswordManagement } from './components/PasswordManagement';

const initialJobApplicationData: JobApplicationData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  linkedin: '',
  portfolio: '',
  workExperience: [],
  education: [],
  skills: [],
};

const mockJobs: Job[] = [
    { id: 1, title: 'Senior Frontend Engineer', company: 'Tech Solutions Inc.', location: 'San Francisco, CA', url: 'https://www.techsolutions.com/careers/frontend-engineer' },
    { id: 2, title: 'Product Designer', company: 'Innovate Co.', location: 'Palo Alto, CA', url: 'https://www.innovateco.com/careers/product-designer' },
    { id: 3, title: 'Data Scientist', company: 'Data Insights LLC', location: 'New York, NY', url: 'https://www.datainsights.com/careers/data-scientist' },
    { id: 4, title: 'Backend Developer', company: 'Server Systems', location: 'Austin, TX', url: 'https://www.serversystems.com/careers/backend-developer' },
];


export default function App() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [jobApplicationData, setJobApplicationData] = useState<JobApplicationData>(initialJobApplicationData);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrollToId, setScrollToId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isParsingForEdit, setIsParsingForEdit] = useState(false);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [preUploadData, setPreUploadData] = useState<JobApplicationData | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [profilePassword, setProfilePassword] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [dropdownView, setDropdownView] = useState<'options' | 'success'>('options');
  const [isManagingPassword, setIsManagingPassword] = useState(false);
  
  const handleProfileCreate = (data: ProfileData, password?: string) => {
    setProfileData(data);
    setProfilePassword(password || null);
  };

  const requestProtectedAction = (action: () => void) => {
    if (profilePassword) {
      setPendingAction(() => action);
      setIsPasswordModalOpen(true);
      setPasswordError(null);
    } else {
      action(); // No password, execute immediately
    }
  };

  const handlePasswordSubmit = (enteredPassword: string) => {
    if (enteredPassword === profilePassword) {
      setIsPasswordModalOpen(false);
      setPasswordError(null);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordError(null);
    setPendingAction(null);
  };

  const handleQuickApply = useCallback(() => {
    if (!profileData) return;
    setJobApplicationData({
      firstName: profileData.contact.firstName,
      lastName: profileData.contact.lastName,
      email: profileData.contact.email,
      phone: profileData.contact.phone,
      linkedin: profileData.contact.linkedin || '',
      portfolio: profileData.contact.portfolio || '',
      workExperience: JSON.parse(JSON.stringify(profileData.workExperience)), // Deep copy
      education: JSON.parse(JSON.stringify(profileData.education)), // Deep copy
      skills: [...profileData.skills],
    });
    setIsSidebarOpen(false);
  }, [profileData]);

  const handleQuickApplyFromDropdown = () => {
    requestProtectedAction(() => {
      setDropdownView('success');
      setTimeout(() => {
        handleQuickApply();
        setIsDropdownOpen(false);
        setDropdownView('options');
      }, 1500);
    });
  };

  const handleGuidedApplyFromDropdown = () => {
    requestProtectedAction(() => {
      setIsSidebarOpen(true);
      setIsDropdownOpen(false);
    });
  };
  
  const handleFieldFill = useCallback((field: string, value: string) => {
    const getScrollId = (field: string) => {
      const contactFields = ['firstName', 'lastName', 'email', 'phone', 'linkedin', 'portfolio'];
      if (contactFields.includes(field)) return field;
      
      const workFields = ['title', 'company', 'location', 'startDate', 'endDate'];
      if (workFields.includes(field)) return `work-0-${field}`;

      const eduFields = ['institution', 'degree', 'fieldOfStudy', 'graduationDate'];
      if (eduFields.includes(field)) return `edu-0-${field}`;

      return null;
    }
    setScrollToId(getScrollId(field));

    setJobApplicationData(prev => {
      const newData = { ...prev };
      const contactFields: (keyof JobApplicationData)[] = ['firstName', 'lastName', 'email', 'phone', 'linkedin', 'portfolio'];
      if (contactFields.includes(field as any)) {
          return { ...prev, [field]: value };
      }

      const workFields: (keyof WorkExperience)[] = ['title', 'company', 'location', 'startDate', 'endDate'];
      if (workFields.includes(field as any)) {
          if (newData.workExperience.length === 0) newData.workExperience.push({ title: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [] });
          (newData.workExperience[0] as any)[field] = value;
          return { ...newData, workExperience: [...newData.workExperience]};
      }

      const eduFields: (keyof Education)[] = ['institution', 'degree', 'fieldOfStudy', 'graduationDate'];
      if (eduFields.includes(field as any)) {
          if (newData.education.length === 0) newData.education.push({ institution: '', degree: '', fieldOfStudy: '', graduationDate: '' });
          (newData.education[0] as any)[field] = value;
          return { ...newData, education: [...newData.education] };
      }
      return prev;
    });
  }, []);

  const handleSelectiveFill = (value: string) => {
    setScrollToId('work-0-responsibilities');
    setJobApplicationData(prev => {
      const newData = { ...prev };
      if (newData.workExperience.length === 0) {
        newData.workExperience.push({ title: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [] });
      }
      const newResponsibilities = [...newData.workExperience[0].responsibilities, value];
      newData.workExperience[0] = { ...newData.workExperience[0], responsibilities: newResponsibilities };
      return { ...newData, workExperience: [...newData.workExperience] };
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsString = e.target.value;
    const skillsArray = skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
    setJobApplicationData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleFillAllSkills = () => {
    if (!profileData) return;
    setScrollToId('skills');
    setJobApplicationData(prev => ({...prev, skills: [...profileData.skills]}));
  };

  const handleSingleSkillAdd = (skillToAdd: string) => {
    setScrollToId('skills');
    setJobApplicationData(prev => {
      if (prev.skills.includes(skillToAdd)) {
        return prev;
      }
      return { ...prev, skills: [...prev.skills, skillToAdd] };
    });
  };

  const handleAddWorkExperienceBlock = (workExperienceToAdd: WorkExperience) => {
    setJobApplicationData(prev => {
      const newWorkExperience = [...prev.workExperience, workExperienceToAdd];
      setTimeout(() => setScrollToId(`work-experience-card-${newWorkExperience.length - 1}`), 0);
      return {
        ...prev,
        workExperience: newWorkExperience
      }
    });
  };
  
  const handleAddEducationBlock = (educationToAdd: Education) => {
    setJobApplicationData(prev => {
      const newEducation = [...prev.education, educationToAdd];
      setTimeout(() => setScrollToId(`education-card-${newEducation.length - 1}`), 0);
      return {
        ...prev,
        education: newEducation
      }
    });
  };

  const handleGoBack = () => {
    if (isManagingPassword) {
      setIsManagingPassword(false);
      return;
    }
    if (isEditingProfile) {
      setIsEditingProfile(false);
      setParsingError(null);
      setJobApplicationData(initialJobApplicationData);
      setPreUploadData(null);
      return;
    }
    setSelectedJob(null);
    setJobApplicationData(initialJobApplicationData);
    setIsSidebarOpen(false);
    setIsDropdownOpen(false);
  };

  const handleScrollComplete = () => {
    setScrollToId(null);
  };

  const handleEditProfile = () => {
    if (!profileData) return;
    const action = () => {
        setJobApplicationData({
        firstName: profileData.contact.firstName,
        lastName: profileData.contact.lastName,
        email: profileData.contact.email,
        phone: profileData.contact.phone,
        linkedin: profileData.contact.linkedin || '',
        portfolio: profileData.contact.portfolio || '',
        workExperience: JSON.parse(JSON.stringify(profileData.workExperience)),
        education: JSON.parse(JSON.stringify(profileData.education)),
        skills: [...profileData.skills],
        });
        setIsEditingProfile(true);
        setIsSidebarOpen(false);
        setIsDropdownOpen(false);
    };

    requestProtectedAction(action);
  };

  const handleProfileUpdate = () => {
    const updatedProfileData: ProfileData = {
      contact: {
        firstName: jobApplicationData.firstName,
        lastName: jobApplicationData.lastName,
        email: jobApplicationData.email,
        phone: jobApplicationData.phone,
        linkedin: jobApplicationData.linkedin,
        portfolio: jobApplicationData.portfolio,
      },
      workExperience: jobApplicationData.workExperience,
      education: jobApplicationData.education,
      skills: jobApplicationData.skills,
    };
    setProfileData(updatedProfileData);
    setIsEditingProfile(false);
    setParsingError(null);
    setJobApplicationData(initialJobApplicationData);
    setPreUploadData(null);
  };
  
  const handleSubmit = () => {
    if (isEditingProfile) {
      handleProfileUpdate();
    } else {
      alert(`Application for ${selectedJob?.title} at ${selectedJob?.company} submitted successfully!`);
    }
  };
  
  const handleResumeUploadForEdit = async (file: File) => {
    setPreUploadData(jobApplicationData); // Store current state before parsing
    setIsParsingForEdit(true);
    setParsingError(null);
    try {
      const parsedProfile = await parseResume(file);
      setJobApplicationData({
        firstName: parsedProfile.contact.firstName,
        lastName: parsedProfile.contact.lastName,
        email: parsedProfile.contact.email,
        phone: parsedProfile.contact.phone,
        linkedin: parsedProfile.contact.linkedin || '',
        portfolio: parsedProfile.contact.portfolio || '',
        workExperience: JSON.parse(JSON.stringify(parsedProfile.workExperience)),
        education: JSON.parse(JSON.stringify(parsedProfile.education)),
        skills: [...parsedProfile.skills],
      });
    } catch (err) {
      setParsingError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setPreUploadData(null); // Clear pre-upload data on error
    } finally {
      setIsParsingForEdit(false);
    }
  };
  
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    const openTimer = setTimeout(() => {
      setIsDropdownOpen(true);
    }, 300);
    return () => clearTimeout(openTimer);
  };

  const handleManagePassword = () => {
    const action = () => {
      setIsManagingPassword(true);
      setIsDropdownOpen(false);
    };
    requestProtectedAction(action);
  };

  const handlePasswordSettingsChange = (newPassword: string | null) => {
    setProfilePassword(newPassword);
    setIsManagingPassword(false);
  };

  // Effect: Scroll to top when switching to the form or edit mode
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedJob, isEditingProfile, isManagingPassword]);


  if (!selectedJob) {
    return <JobList jobs={mockJobs} onJobSelect={handleJobSelect} />;
  }

  return (
    <div className="flex h-screen font-sans bg-slate-100">
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen && !isEditingProfile ? 'lg:mr-[400px]' : ''} flex items-center justify-center p-4 sm:p-8`}>
        <BrowserFrame 
          job={selectedJob} 
          onAutofillClick={() => setIsDropdownOpen(prev => !prev)} 
          scrollContainerRef={scrollContainerRef}
          isEditingProfile={isEditingProfile}
          isManagingPassword={isManagingPassword}
        >
            {isManagingPassword ? (
              <PasswordManagement
                currentPassword={profilePassword}
                onSave={handlePasswordSettingsChange}
                onCancel={handleGoBack}
              />
            ) : (
              <JobApplicationForm 
                job={selectedJob}
                formData={jobApplicationData}
                setFormData={setJobApplicationData}
                setActiveField={setActiveField}
                onGoBack={handleGoBack}
                onSkillsChange={handleSkillsChange}
                scrollToId={scrollToId}
                onScrollComplete={handleScrollComplete}
                isEditingProfile={isEditingProfile}
                onSubmit={handleSubmit}
                onParseResume={handleResumeUploadForEdit}
                isParsing={isParsingForEdit}
                parseError={parsingError}
                hasUnsavedChangesFromUpload={preUploadData !== null}
              />
            )}
            <AutofillDropdown
              isVisible={isDropdownOpen}
              onClose={() => {
                  setIsDropdownOpen(false);
                  setDropdownView('options'); // Reset on manual close
              }}
              onQuickApply={handleQuickApplyFromDropdown}
              onGuidedApply={handleGuidedApplyFromDropdown}
              onEditProfile={handleEditProfile}
              onManagePassword={handleManagePassword}
              profileData={profileData}
              onProfileCreate={handleProfileCreate}
              parseResume={parseResume}
              view={dropdownView}
            />
        </BrowserFrame>
      </main>
      {profileData && (
        <GuidedApplySidebar
            isOpen={isSidebarOpen && !isEditingProfile}
            onClose={() => setIsSidebarOpen(false)}
            profileData={profileData}
            activeField={activeField}
            onFieldFill={handleFieldFill}
            onSelectiveFill={handleSelectiveFill}
            onFillAllSkills={handleFillAllSkills}
            onAddSkill={handleSingleSkillAdd}
            onAddWorkExperienceBlock={handleAddWorkExperienceBlock}
            onAddEducationBlock={handleAddEducationBlock}
        />
      )}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        onSubmit={handlePasswordSubmit}
        error={passwordError}
      />
    </div>
  );
}
