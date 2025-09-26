import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { User } from '$lib/types';

let users: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@example.com',
    createdAt: new Date('2024-01-02')
  }
];

// GET - Listar todos os usuários
export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');
  
  if (!id) {
    return json(users);
  }
  
  const user = users.find(u => u.id === parseInt(id));
  
  if (!user) {
    return json({ error: 'Usuário não encontrado' }, { status: 404 });
  }
  
  return json(user);
};

// POST - Criar novo usuário
export const POST: RequestHandler = async ({ request }) => {
  const { name, email } = await request.json();
  
  if (!name || !email) {
    return json({ error: 'Nome e email são obrigatórios' }, { status: 400 });
  }

  const newUser: User = {
    id: Math.max(...users.map(u => u.id)) + 1,
    name,
    email,
    createdAt: new Date()
  };

  users.push(newUser);
  return json(newUser, { status: 201 });
};

// PUT - Editar usuário existente
export const PUT: RequestHandler = async ({ request }) => {
  const { id, name, email } = await request.json();
  
  if (!id) {
    return json({ error: 'ID é obrigatório' }, { status: 400 });
  }

  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;

  return json(users[userIndex]);
};
