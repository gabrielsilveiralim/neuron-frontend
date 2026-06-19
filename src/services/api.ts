import type { ChatResponse, IngestForm, IngestResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://neuron-backend-ten.vercel.app';

async function safeFetch(url: string, options: RequestInit) {
  try {
    return await fetch(url, options);
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
  }
}

export async function sendMessage(message: string): Promise<ChatResponse> {
  const response = await safeFetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? 'Erro ao enviar mensagem');
  }

  return response.json();
}

export async function ingestDocument(form: IngestForm): Promise<IngestResponse> {
  const response = await safeFetch(`${API_URL}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: form.content,
      title: form.title || undefined,
      source: form.source || 'manual',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? 'Erro ao ingerir documento');
  }

  return response.json();
}