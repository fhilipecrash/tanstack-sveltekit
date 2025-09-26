import type { Post, User } from './types';

const baseUrl = '/api';

export const api = (fetchFn = fetch) => ({
  getPosts: async (): Promise<Post[]> => {
    const response = await fetchFn(`${baseUrl}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return (await response.json()) as Post[];
  },
  getPostById: async (id: number): Promise<Post> => {
    const response = await fetchFn(`${baseUrl}/posts?id=${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post with id ${id}`);
    }
    return (await response.json()) as Post;
  },
  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const response = await fetchFn(`${baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    return (await response.json()) as Post;
  },
  updatePost: async (id: number, post: Partial<Omit<Post, 'id'>>): Promise<Post> => {
    const response = await fetchFn(`${baseUrl}/posts?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error(`Failed to update post with id ${id}`);
    }
    return (await response.json()) as Post;
  },
  deletePost: async (id: number): Promise<Post> => {
    const response = await fetchFn(`${baseUrl}/posts?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete post with id ${id}`);
    }
    return (await response.json()) as Post;
  },
  getUsers: async (): Promise<User[]> => {
    const response = await fetchFn(`${baseUrl}/profile`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user profiles`);
    }
    return (await response.json()) as User[];
  },
  getUserById: async (id: number): Promise<User> => {
    const response = await fetchFn(`${baseUrl}/profile?id=${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile with id ${id}`);
    }
    return (await response.json()) as User;
  },
  createUser: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const response = await fetchFn(`${baseUrl}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to create user profile');
    }
    return (await response.json()) as User;
  },
  updateUser: async (id: number, user: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> => {
    const response = await fetchFn(`${baseUrl}/profile?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user profile with id ${id}`);
    }
    return (await response.json()) as User;
  },
});
