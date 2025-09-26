import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Post } from '$lib/types';

let posts: Post[] = [
	{
		id: 1,
		userId: 1,
		title: 'Primeiro Post',
		body: 'Este é o conteúdo do primeiro post. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	},
	{
		id: 2,
		userId: 1,
		title: 'Segundo Post',
		body: 'Conteúdo do segundo post. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
	},
	{
		id: 3,
		userId: 2,
		title: 'Terceiro Post',
		body: 'Este é o terceiro post da nossa aplicação. Ut enim ad minim veniam, quis nostrud exercitation.',
	},
];

let nextId = 4;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET: RequestHandler = async ({ url }) => {
	await delay(1000);

	const postId = url.searchParams.get('id');

	if (postId) {
		const post = posts.find((p) => p.id === parseInt(postId));
		if (!post) {
			return json({ error: 'Post not found' }, { status: 404 });
		}
		return json(post);
	}

	return json(posts);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { userId, title, body: content } = body;

		if (!userId || !title || !content) {
			return json(
				{ error: 'Missing required fields: userId, title, body' },
				{ status: 400 }
			);
		}

		const newPost: Post = {
			id: nextId++,
			userId: Number(userId),
			title: String(title),
			body: String(content),
		};

		posts.push(newPost);

		return json(newPost, { status: 201 });
	} catch (error) {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
};

export const PUT: RequestHandler = async ({ request, url }) => {
	try {
		const postId = url.searchParams.get('id');

		if (!postId) {
			return json({ error: 'Post ID is required' }, { status: 400 });
		}

		const postIndex = posts.findIndex((p) => p.id === parseInt(postId));

		if (postIndex === -1) {
			return json({ error: 'Post not found' }, { status: 404 });
		}

		const body = await request.json();
		const { userId, title, body: content } = body;

		const updatedPost: Post = {
			...posts[postIndex],
			...(userId && { userId: Number(userId) }),
			...(title && { title: String(title) }),
			...(content && { body: String(content) }),
		};

		posts[postIndex] = updatedPost;

		return json(updatedPost);
	} catch (error) {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}
};

export const DELETE: RequestHandler = async ({ url }) => {
	const postId = url.searchParams.get('id');

	if (!postId) {
		return json({ error: 'Post ID is required' }, { status: 400 });
	}

	const postIndex = posts.findIndex((p) => p.id === parseInt(postId));

	if (postIndex === -1) {
		return json({ error: 'Post not found' }, { status: 404 });
	}

	const deletedPost = posts.splice(postIndex, 1)[0];

	return json(deletedPost);
};
