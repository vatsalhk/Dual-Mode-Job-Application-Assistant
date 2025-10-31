import { GoogleGenAI, Type } from "@google/genai";
import type { ProfileData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    contact: {
      type: Type.OBJECT,
      properties: {
        firstName: { type: Type.STRING },
        lastName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        linkedin: { type: Type.STRING, nullable: true },
        portfolio: { type: Type.STRING, nullable: true },
      },
      required: ["firstName", "lastName", "email", "phone"]
    },
    workExperience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          location: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "company", "startDate", "endDate", "responsibilities"]
      }
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          fieldOfStudy: { type: Type.STRING },
          graduationDate: { type: Type.STRING },
        },
        required: ["institution", "degree", "fieldOfStudy", "graduationDate"]
      }
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["contact", "workExperience", "education", "skills"]
};

const mockProfileData: ProfileData = {
  contact: {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    phone: "123-456-7890",
    linkedin: "linkedin.com/in/janedoe",
    portfolio: "janedoe.dev"
  },
  workExperience: [
    {
      title: "Senior Frontend Engineer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2020",
      endDate: "Present",
      responsibilities: [
        "Led the development of a new client-facing dashboard using React and TypeScript.",
        "Improved application performance by 30% through code splitting and lazy loading.",
        "Mentored junior engineers and conducted code reviews."
      ]
    },
    {
        title: "Software Engineer",
        company: "Innovate Co.",
        location: "Palo Alto, CA",
        startDate: "Jun 2017",
        endDate: "Dec 2019",
        responsibilities: [
          "Developed and maintained features for a large-scale e-commerce platform.",
          "Collaborated with UX/UI designers to implement responsive and accessible interfaces.",
          "Wrote unit and integration tests to ensure code quality."
        ]
    }
  ],
  education: [
    {
      institution: "State University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      graduationDate: "May 2017"
    }
  ],
  skills: ["React", "TypeScript", "JavaScript", "Node.js", "GraphQL", "Tailwind CSS", "Jest"]
};


const fileToGenerativePart = (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('Failed to read file.'));
      }
      const data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
  });
};


export const parseResume = async (file: File): Promise<ProfileData> => {
  if (!ai) {
    console.log("Using mock data for resume parsing.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    return mockProfileData;
  }
  
  try {
    const filePart = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { 
        parts: [
          { text: "Parse the following resume document and extract the user's profile information. The output must be in JSON format matching the provided schema." },
          filePart
        ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    return parsedData as ProfileData;

  } catch (error) {
    console.error("Error parsing resume with Gemini:", error);
    throw new Error("Failed to parse resume. Please check the file format or try again.");
  }
};
