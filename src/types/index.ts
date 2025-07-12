export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
  postedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  buyLink: string;
}
