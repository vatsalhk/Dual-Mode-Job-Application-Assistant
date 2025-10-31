
export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
}

export interface WorkExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
}

export interface ProfileData {
  contact: ContactInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
}


export interface JobApplicationData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    linkedin: string;
    portfolio: string;
    workExperience: WorkExperience[];
    education: Education[];
    skills: string[];
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  url: string;
}