<script lang="ts">
  import { api } from "$lib/api";
  import { createQuery, createMutation, useQueryClient } from "@tanstack/svelte-query";
  import type { Post } from "$lib/types";

  const queryClient = useQueryClient();

  const posts = createQuery({
    queryKey: ['posts'],
    queryFn: async () => await api().getPosts(),
  });

  const createPost = createMutation({
    mutationFn: async (post: Omit<Post, 'id'>) => api().createPost(post),
    onSuccess: (data) => {
      queryClient.setQueryData(['posts'], (posts: Post[]) => {
        return [...posts, {
          userId: data.userId,
          title: data.title,
          body: data.body,
          id: data.id,
        }];
      });
      resetForm();
    }
  });

  const updatePost = createMutation({
    mutationFn: async ({ id, ...post }: Partial<Post> & { id: number }) => api().updatePost(id, post),
    onSuccess: (data) => {
      queryClient.setQueryData(['posts'], (posts: Post[]) => {
        return posts.map(post => post.id === data.id ? data : post);
      });
      editingId = null;
      resetForm();
    }
  });

  const deletePost = createMutation({
    mutationFn: async (id: number) => api().deletePost(id),
    onSuccess: (data) => {
      queryClient.setQueryData(['posts'], (posts: Post[]) => {
        return posts.filter(post => post.id !== data.id);
      });
    }
  });

  let title = $state('');
  let body = $state('');
  let userId = $state(1);
  let editingId = $state<number | null>(null);

  function resetForm() {
    title = '';
    body = '';
    userId = 1;
    editingId = null;
  }

  function handleSubmit() {
    if (!title.trim() || !body.trim()) return;

    if (editingId) {
      $updatePost.mutate({ id: editingId, title, body, userId });
    } else {
      $createPost.mutate({ title, body, userId });
    }
  }

  function editPost(post: Post) {
    editingId = post.id;
    title = post.title;
    body = post.body;
    userId = post.userId;
  }

  function handleDelete(id: number) {
    if (confirm('Tem certeza que deseja deletar este post?')) {
      $deletePost.mutate(id);
    }
  }
</script>

<div class="max-w-4xl mx-auto p-6">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Posts</h1>

  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
      {editingId ? 'Editar Post' : 'Criar Novo Post'}
    </h2>
    
    <form onsubmit={handleSubmit} class="space-y-4">
      <div>
        <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">
          User ID
        </label>
        <input
          id="userId"
          type="number"
          bind:value={userId}
          min="1"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          id="title"
          type="text"
          bind:value={title}
          placeholder="Digite o título do post"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label for="body" class="block text-sm font-medium text-gray-700 mb-1">
          Conteúdo
        </label>
        <textarea
          id="body"
          bind:value={body}
          placeholder="Digite o conteúdo do post"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        ></textarea>
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim() || !body.trim() || $createPost.isPending || $updatePost.isPending}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if $createPost.isPending || $updatePost.isPending}
            <span class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
          {:else}
            {editingId ? 'Atualizar Post' : 'Criar Post'}
          {/if}
        </button>

        {#if editingId}
          <button
            type="button"
            onclick={resetForm}
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        {/if}
      </div>
    </form>
  </div>

  {#if $posts.status === 'pending'}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600">Carregando posts...</span>
    </div>
  {:else if $posts.status === 'error'}
    <div class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Erro ao carregar posts</h3>
          <p class="mt-1 text-sm text-red-700">{$posts.error.message}</p>
        </div>
      </div>
    </div>
  {:else}
    <div class="space-y-4">
      {#each $posts.data as post (post.id)}
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{post.title}</h3>
              <p class="text-sm text-gray-500">Post #{post.id} • User #{post.userId}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <button
                onclick={() => editPost(post)}
                class="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                Editar
              </button>
              <button
                onclick={() => handleDelete(post.id)}
                disabled={$deletePost.isPending}
                class="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {$deletePost.isPending ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed">{post.body}</p>
        </div>
      {/each}

      {#if $posts.data.length === 0}
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum post encontrado</h3>
          <p class="mt-1 text-sm text-gray-500">Comece criando seu primeiro post.</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
