import { api } from "$lib/api";
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export async function load({ fetch }) {
  const users = await api(fetch).getUsers();
  return { users };
}

export const actions: Actions = {
  create: async ({ request, fetch }) => {
    const data = await request.formData();
    const name = data.get('name')?.toString();
    const email = data.get('email')?.toString();

    if (!name || !email) {
      return fail(400, { 
        error: 'Nome e email são obrigatórios',
        name,
        email 
      });
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return fail(400, { 
        error: 'Email inválido',
        name,
        email 
      });
    }

    try {
      const newUser = await api(fetch).createUser({ name, email });
      return { 
        success: true, 
        message: 'Usuário criado com sucesso!',
        user: newUser 
      };
    } catch (error) {
      return fail(500, { 
        error: 'Erro ao criar usuário. Tente novamente.',
        name,
        email 
      });
    }
  }
};
