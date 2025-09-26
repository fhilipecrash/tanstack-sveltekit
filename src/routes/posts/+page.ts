import { api } from '$lib/api';

export async function load({ fetch, parent }) {
  const { queryClient } = await parent();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: async () => await api(fetch).getPosts(),
  });
}
