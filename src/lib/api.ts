import type { Post } from './types';

const baseUrl = '/api';

export const api = (customFetch = fetch) => ({
  getPosts: async (): Promise<Post[]> => {
    const response = await customFetch(`${baseUrl}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return (await response.json()) as Post[];
  },
  getPostById: async (id: number): Promise<Post> => {
    const response = await customFetch(`${baseUrl}/posts?id=${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post with id ${id}`);
    }
    return (await response.json()) as Post;
  },
  createPost: async (post: Omit<Post, 'id'>): Promise<Post> => {
    const response = await customFetch(`${baseUrl}/posts`, {
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
    const response = await customFetch(`${baseUrl}/posts?id=${id}`, {
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
    const response = await customFetch(`${baseUrl}/posts?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete post with id ${id}`);
    }
    return (await response.json()) as Post;
  },
});
