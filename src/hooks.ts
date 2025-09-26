import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
  request.headers.set('Authorization', 'my-special-cookie');
	return fetch(request);
}
