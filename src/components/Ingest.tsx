import { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ingestDocument } from '../services/api';
import type { IngestForm } from '../types';

const INITIAL_FORM: IngestForm = {
  title: '',
  content: '',
  source: 'manual',
};

export function Ingest() {
  const [form, setForm] = useState<IngestForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!form.content.trim()) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const result = await ingestDocument(form);
      setSuccess(`Salvo — ${result.chunksCreated} trecho${result.chunksCreated !== 1 ? 's' : ''} indexado${result.chunksCreated !== 1 ? 's' : ''}.`);
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}> Nova anotação </h2>
      <p className="text-sm text-[#6B6862] dark:text-[#8C8879] mb-8">
        O que você escrever aqui passa a fazer parte da sua memória.
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-mono uppercase tracking-wide text-[#A8A296] dark:text-[#5C594F] mb-1.5"> Título </label>
            <input type="text" placeholder="Sem título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-base border-0 border-b rounded-none px-1" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-mono uppercase tracking-wide text-[#A8A296] dark:text-[#5C594F] mb-1.5"> Fonte </label>
            <input type="text" placeholder="manual" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="input-base border-0 border-b rounded-none px-1" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wide text-[#A8A296] dark:text-[#5C594F] mb-1.5"> Conteúdo </label>
          <textarea placeholder="Escreva ou cole o texto aqui..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} className="input-base resize-none" />
          <p className="text-xs font-mono text-[#A8A296] dark:text-[#5C594F] mt-1.5">
            {form.content.length} caracteres
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#6B8E5A' }}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#B5564A' }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading || !form.content.trim()} className="btn-primary self-start flex items-center gap-2" >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}