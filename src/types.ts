export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type PostType = 'Request' | 'Offer';
export type UrgencyLevel = 'Low' | 'Medium' | 'High';

export interface CommunityPost {
  id: string;
  type: PostType;
  title: string;
  description: string;
  category: string;
  location: string;
  contactPreference: string;
  
  // Only for Request
  urgencyLevel?: UrgencyLevel;
  status: 'Open' | 'Pending' | 'Resolved';
  
  // Only for Offer
  availability?: string;
  
  imageUrl?: string;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  
  likes: string[]; // List of user emails who liked this post
  saves: string[]; // List of user emails who saved this post
}

// Retro compatibility definitions
export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'Open' | 'Pending' | 'Resolved';
  userEmail: string;
  createdAt: string;
}

export interface OfferdService {
  id: string;
  title: string;
  description: string;
  category: string;
  userEmail: string;
  createdAt: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
