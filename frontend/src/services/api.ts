import axios from 'axios';
import { Filme, FilmeCreateInput, FilmeUpdateInput } from '../types/filme';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const filmeApi = {
  getAll: async (params?: { busca?: string; genero?: string; status?: string }) => {
    const response = await api.get<Filme[]>('/filmes', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Filme>(`/filmes/${id}`);
    return response.data;
  },

  create: async (data: FilmeCreateInput) => {
    const response = await api.post<Filme>('/filmes', data);
    return response.data;
  },

  update: async (id: number, data: FilmeUpdateInput) => {
    const response = await api.put<Filme>(`/filmes/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/filmes/${id}`);
  },
};