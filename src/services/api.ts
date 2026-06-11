import axios from 'axios';
import { User, CommunityPost, HelpRequest, OfferdService } from '../types';

// API Axios Instance
const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://api.community-help-platform.local/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor for Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for handling global errors (e.g. 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage on unauthorized
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to simulate network latency for Phase 1 & 2 Frontend Mock Integration
const simulateNetwork = <T>(data: T, shouldSucceed = true, delay = 600): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve(data);
      } else {
        reject(new Error('Simulated api error.'));
      }
    }, delay);
  });
};

// Simulated Local Database in localStorage
const getStoredUsers = (): any[] => {
  const users = localStorage.getItem('mock_users');
  return users ? JSON.parse(users) : [];
};

const saveStoredUsers = (users: any[]) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

// Unified mock posts storage helper
export const getStoredPosts = (): CommunityPost[] => {
  const posts = localStorage.getItem('mock_community_posts');
  if (!posts) {
    const defaultPosts: CommunityPost[] = [
      {
        id: 'post-1',
        type: 'Request',
        title: 'Grocery delivery support for elderly neighbor',
        description: 'Mrs. Gable is unable to walk long distances due to a recent knee surgery. Looking for a kind volunteer to pick up her pre-ordered groceries from Safeway this Thursday afternoon around 3 PM and drop them off at her porch.',
        category: 'Errands & Delivery',
        location: 'Downtown Plains',
        contactPreference: 'Phone Call',
        urgencyLevel: 'High',
        status: 'Open',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
        userEmail: 'support@communityhelp.org',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
        likes: ['neighbor-1@help.org'],
        saves: []
      },
      {
        id: 'post-2',
        type: 'Request',
        title: 'Weekly chemistry tutoring for high school student',
        description: 'My sophomore daughter is struggling with organic chemistry concepts. Looking for a tutor who can hold a 1-hour session once a week, preferably online or at the local library. Happy to compensate with home-baked cookies of your choice!',
        category: 'Education & Tutoring',
        location: 'Westside Suburbs',
        contactPreference: 'Email',
        urgencyLevel: 'Medium',
        status: 'Open',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600',
        userEmail: 'learning@education.org',
        userName: 'David Miller',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        createdAt: new Date(Date.now() - 3600000 * 20).toISOString(), // 20 hours ago
        likes: [],
        saves: ['support@communityhelp.org']
      },
      {
        id: 'post-3',
        type: 'Offer',
        title: 'Dog walking & pet sitting on weekends',
        description: 'I love animals and would be thrilled to walk your friendly dogs or watch your pets/cats in the downtown/Westside area over weekends. I have owned dogs my entire life and am comfortable with big breeds. Fully free-of-charge for elderly or disabled neighbors.',
        category: 'Pet Care',
        location: 'Downtown Plains',
        contactPreference: 'Portal Chat',
        status: 'Open',
        availability: 'Saturdays & Sundays (All Day)',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
        userEmail: 'pets@communityhelp.org',
        userName: 'Lacey Stone',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
        likes: ['support@communityhelp.org', 'learning@education.org'],
        saves: []
      },
      {
        id: 'post-4',
        type: 'Offer',
        title: 'Basic yard cleanup and lawn mowing assistance',
        description: 'I own a commercial gas mower, weed eater, and leaf blower. Prepared to help tidy up yards, trim bushes, and clear driveways for residents who are physically unable to manage yard care themselves. Available on Sunday mornings.',
        category: 'Yard Work',
        location: 'East Valley',
        contactPreference: 'Text Message',
        status: 'Open',
        availability: 'Sunday Mornings (8 AM - 12 PM)',
        imageUrl: 'https://images.unsplash.com/photo-1558905611-0bbd9ea18ab2?auto=format&fit=crop&q=80&w=600',
        userEmail: 'yardcare@gmail.com',
        userName: 'Marcus Aurel',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        createdAt: new Date(Date.now() - 3600000 * 30).toISOString(), // 30 hours ago
        likes: ['learning@education.org'],
        saves: []
      },
      {
        id: 'post-5',
        type: 'Request',
        title: 'Leaking pipe assistance in community kitchen',
        description: 'Our community kitchen sink pipe has had a slow drip that is getting worse. Need someone with plumbing knowledge to help replace the washer and seal the pipe. We have the basic parts, just need the expertise and tools (like a pipe wrench).',
        category: 'Home Repair & Handyman',
        location: 'Central Heights',
        contactPreference: 'Email',
        urgencyLevel: 'High',
        status: 'Resolved',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
        userEmail: 'center@community.org',
        userName: 'Robert Vance',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
        likes: ['support@communityhelp.org'],
        saves: []
      }
    ];
    localStorage.setItem('mock_community_posts', JSON.stringify(defaultPosts));
    return defaultPosts;
  }
  return JSON.parse(posts);
};

export const saveStoredPosts = (posts: CommunityPost[]) => {
  localStorage.setItem('mock_community_posts', JSON.stringify(posts));
};

// API Services
export const authService = {
  login: async (email: string, password_raw: string): Promise<{ token: string; user: User }> => {
    try {
      const users = getStoredUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!existingUser) {
        throw new Error('No user found with this email. Please register first.');
      }
      
      if (existingUser.password !== password_raw) {
        throw new Error('Incorrect password. Please try again.');
      }

      const user: User = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        mobile: existingUser.mobile,
        createdAt: existingUser.createdAt,
        avatarUrl: existingUser.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150`
      };
      
      const token = `mock_token_${user.id}_${Date.now()}`;
      return simulateNetwork({ token, user });
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  },

  register: async (name: string, email: string, password_raw: string, mobile?: string): Promise<{ token: string; user: User }> => {
    try {
      const users = getStoredUsers();
      const emailLower = email.toLowerCase();
      
      if (users.some(u => u.email.toLowerCase() === emailLower)) {
        throw new Error('An account with this email already exists.');
      }

      const newUserDb = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        name,
        email: emailLower,
        password: password_raw,
        mobile,
        createdAt: new Date().toISOString(),
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`
      };

      users.push(newUserDb);
      saveStoredUsers(users);

      const user: User = {
        id: newUserDb.id,
        name: newUserDb.name,
        email: newUserDb.email,
        mobile: newUserDb.mobile,
        createdAt: newUserDb.createdAt,
        avatarUrl: newUserDb.avatarUrl
      };

      const token = `mock_token_${user.id}_${Date.now()}`;
      return simulateNetwork({ token, user });
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }
  },

  resetPassword: async (email: string, newPassword_raw: string): Promise<boolean> => {
    try {
      const users = getStoredUsers();
      const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (userIndex === -1) {
        throw new Error('No user account found with this email address.');
      }
      users[userIndex].password = newPassword_raw;
      saveStoredUsers(users);
      return simulateNetwork(true);
    } catch (err: any) {
      throw new Error(err.message || 'Password reset failed.');
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      const authUserStr = localStorage.getItem('auth_user');
      if (!token || !authUserStr) return null;
      
      const user = JSON.parse(authUserStr) as User;
      return simulateNetwork(user);
    } catch {
      return null;
    }
  }
};

export const helpService = {
  // Get all unified community posts (V2)
  getPosts: async (): Promise<CommunityPost[]> => {
    return simulateNetwork(getStoredPosts());
  },

  getPostById: async (id: string): Promise<CommunityPost | undefined> => {
    const posts = getStoredPosts();
    const post = posts.find((p) => p.id === id);
    return simulateNetwork(post);
  },

  createPost: async (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'likes' | 'saves'>): Promise<CommunityPost> => {
    const posts = getStoredPosts();
    const newPost: CommunityPost = {
      ...postData,
      id: 'post-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      likes: [],
      saves: []
    };
    
    posts.unshift(newPost);
    saveStoredPosts(posts);
    return simulateNetwork(newPost);
  },

  updatePost: async (id: string, updatedData: Partial<CommunityPost>): Promise<CommunityPost> => {
    const posts = getStoredPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    
    const updatedPost = {
      ...posts[index],
      ...updatedData
    };
    
    posts[index] = updatedPost;
    saveStoredPosts(posts);
    return simulateNetwork(updatedPost);
  },

  deletePost: async (id: string): Promise<boolean> => {
    const posts = getStoredPosts();
    const filtered = posts.filter((p) => p.id !== id);
    saveStoredPosts(filtered);
    return simulateNetwork(true);
  },

  // Toggle Like on a Post
  toggleLikePost: async (id: string, userEmail: string): Promise<CommunityPost> => {
    const posts = getStoredPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    
    const post = posts[index];
    const emailIndex = post.likes.indexOf(userEmail);
    if (emailIndex === -1) {
      post.likes.push(userEmail);
    } else {
      post.likes.splice(emailIndex, 1);
    }
    
    posts[index] = post;
    saveStoredPosts(posts);
    return simulateNetwork(post);
  },

  // Toggle Save on a Post
  toggleSavePost: async (id: string, userEmail: string): Promise<CommunityPost> => {
    const posts = getStoredPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('Post not found');
    }
    
    const post = posts[index];
    const emailIndex = post.saves.indexOf(userEmail);
    if (emailIndex === -1) {
      post.saves.push(userEmail);
    } else {
      post.saves.splice(emailIndex, 1);
    }
    
    posts[index] = post;
    saveStoredPosts(posts);
    return simulateNetwork(post);
  },

  // --- RETRO-COMPATIBILITY WRAPPERS FOR PHASE 1 CALLS ---
  getRequests: async (): Promise<HelpRequest[]> => {
    const posts = getStoredPosts();
    // Map CommunityPost to HelpRequest structure
    const requests = posts
      .filter((p) => p.type === 'Request')
      .map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        status: p.status,
        userEmail: p.userEmail,
        createdAt: p.createdAt
      }));
    return simulateNetwork(requests);
  },

  createRequest: async (title: string, description: string, category: string, userEmail: string): Promise<HelpRequest> => {
    const posts = getStoredPosts();
    // Simulate user details if possible
    const authUser = localStorage.getItem('auth_user');
    let userName = 'Anonymous';
    if (authUser) {
      const parsedUser = JSON.parse(authUser);
      if (parsedUser.email === userEmail) {
        userName = parsedUser.name;
      }
    }
    
    const newPost: CommunityPost = {
      id: 'post-' + Math.random().toString(36).substring(2, 9),
      type: 'Request',
      title,
      description,
      category,
      location: 'Downtown Plains',
      contactPreference: 'Email',
      urgencyLevel: 'Medium',
      status: 'Open',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
      userEmail,
      userName,
      createdAt: new Date().toISOString(),
      likes: [],
      saves: []
    };
    
    posts.unshift(newPost);
    saveStoredPosts(posts);
    
    return simulateNetwork({
      id: newPost.id,
      title: newPost.title,
      description: newPost.description,
      category: newPost.category,
      status: newPost.status,
      userEmail: newPost.userEmail,
      createdAt: newPost.createdAt
    });
  },

  getServices: async (): Promise<OfferdService[]> => {
    const posts = getStoredPosts();
    const services = posts
      .filter((p) => p.type === 'Offer')
      .map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        userEmail: p.userEmail,
        createdAt: p.createdAt
      }));
    return simulateNetwork(services);
  },

  offerService: async (title: string, description: string, category: string, userEmail: string): Promise<OfferdService> => {
    const posts = getStoredPosts();
    const authUser = localStorage.getItem('auth_user');
    let userName = 'Anonymous';
    if (authUser) {
      const parsedUser = JSON.parse(authUser);
      if (parsedUser.email === userEmail) {
        userName = parsedUser.name;
      }
    }

    const newPost: CommunityPost = {
      id: 'post-' + Math.random().toString(36).substring(2, 9),
      type: 'Offer',
      title,
      description,
      category,
      location: 'Downtown Plains',
      contactPreference: 'Email',
      status: 'Open',
      availability: 'Flexible',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      userEmail,
      userName,
      createdAt: new Date().toISOString(),
      likes: [],
      saves: []
    };
    
    posts.unshift(newPost);
    saveStoredPosts(posts);

    return simulateNetwork({
      id: newPost.id,
      title: newPost.title,
      description: newPost.description,
      category: newPost.category,
      userEmail: newPost.userEmail,
      createdAt: newPost.createdAt
    });
  }
};

export default api;
