<script lang="ts">
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { LayoutData } from "./$types";

	type Props = {
		data: LayoutData
		children: any
	};

	let { data, children }: Props = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={data.queryClient}>
	<nav class="p-4 border-b border-gray-200 mb-4">
		<a href="/" class="text-lg font-bold">Home</a>
		<a href="/posts" class="ml-4 text-lg font-bold">Posts</a>
		<a href="/profile" class="ml-4 text-lg font-bold">Profile</a>
	</nav>
	{@render children?.()}
</QueryClientProvider>
