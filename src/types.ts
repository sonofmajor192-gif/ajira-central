export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  requirements: string;
  deadline: string;
  applyUrl: string;
  featured: boolean;
  createdAt: string;
  companyLogo?: string;
}

export type JobInput = Omit<Job, "id" | "createdAt">;
