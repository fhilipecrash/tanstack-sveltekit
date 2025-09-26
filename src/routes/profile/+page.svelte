<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  type Props = {
    data: PageData;
    form?: ActionData;
  }

  let { data, form }: Props = $props();
  let createUserForm: HTMLFormElement | undefined = $state();
  let isCreating = $state(false);
</script>

<div class="max-w-4xl mx-auto p-6">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Perfis do Usuário</h1>
  {#each data.users as user}
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Informações do Perfil</h2>
      <div class="space-y-2">
        <p><span class="font-medium text-gray-700">ID:</span> {user.id}</p>
        <p><span class="font-medium text-gray-700">Nome:</span> {user.name}</p>
        <p><span class="font-medium text-gray-700">Email:</span> {user.email}</p>
        <p><span class="font-medium text-gray-700">Criado em:</span> {new Date(user.createdAt).toLocaleDateString('pt-BR')}</p>
      </div>
    </div>
  {/each}

  <div class="mb-4">
    <button
      onclick={() => isCreating = !isCreating}
      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {isCreating ? 'Cancelar' : 'Criar Novo Usuário'}
    </button>
  </div>

  {#if isCreating}
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Criar Novo Usuário</h2>

      {#if form?.success}
        <div class="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">{form.message}</p>
              {#if form.user}
                <p class="text-sm text-green-700">Usuário criado: {form.user.name} ({form.user.email})</p>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      {#if form?.error}
        <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">{form.error}</p>
            </div>
          </div>
        </div>
      {/if}

      <form 
        method="POST" 
        action="?/create"
        bind:this={createUserForm}
        use:enhance={() => {
          return async ({ result, update }) => {
            if (result.type === 'success') {
              createUserForm?.reset();
              isCreating = false;
            }
            await update();
          };
        }}
        class="space-y-4"
      >
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form?.name || ''}
            placeholder="Digite o nome completo"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form?.email || ''}
            placeholder="Digite o email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="flex gap-2">
          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Criar Usuário
          </button>
          
          <button
            type="button"
            onclick={() => isCreating = false}
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

