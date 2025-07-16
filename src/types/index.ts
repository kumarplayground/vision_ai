export interface Job {
  _id: string;
  id: string; // id is an alias for _id
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
  createdAt: string;
}

export interface Course {
  _id: string;
  id: string; // id is an alias for _id
  title: string;
  description: string;
  thumbnail: string;
  buyLink: string;
}
