export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  hasVoted: boolean;
}

export interface Award {
  id: string;
  title: string;
  description: string;
  category: string;
  nominees: Nominee[];
}

export interface Nominee {
  id: string;
  name: string;
  description: string;
  image?: string;
  media?: {
    type: "image" | "video" | "audio" | "text";
    url?: string;
    content?: string;
    title?: string;
  };
}

export interface Vote {
  id: string;
  userId: string;
  awardId: string;
  rankings: string[]; // Array de nominee IDs en orden de preferencia (mejor a peor)
  timestamp: string;
}

export interface VotingSystem {
  users: User[];
  awards: Award[];
  votes: Vote[];
}
