import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2, Brain } from 'lucide-react';
import { sendMessage } from '../services/api';
import type { Message } from '../types';

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Pergunte qualquer coisa sobre suas notas.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.answer,
          sourcesUsed: response.sourcesUsed,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: err instanceof Error ? `Erro: ${err.message}` : 'Erro desconhecido.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F0EBE0', color: '#8B7355' }} >
                <Brain className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[75%] flex flex-col gap-1.5 ${ message.role === 'user' ? 'items-end' : 'items-start' }`} >
              <div className="px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap rounded-lg"
                style={
                  message.role === 'user'
                    ? {
                        backgroundColor: '#8B7355',
                        color: '#FAF9F6',
                        borderTopRightRadius: '2px',
                      }
                    : {
                        border: '1px solid #E8E4DC',
                        borderTopLeftRadius: '2px',
                      }
                } >
                {message.content}
              </div>

              {message.role === 'assistant' &&
                message.sourcesUsed !== undefined &&
                message.sourcesUsed > 0 && (
                  <p className="text-xs font-mono px-1" style={{ color: '#A8956F' }}>
                    {message.sourcesUsed} trecho{message.sourcesUsed !== 1 ? 's' : ''} das notas
                  </p>
                )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#F0EBE0', color: '#8B7355' }} >
              <Brain className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-lg" style={{ border: '1px solid #E8E4DC', borderTopLeftRadius: '2px' }} >
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#A8A296' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="">
        <div className="flex gap-2 items-end">
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escreva sua pergunta..." rows={1} disabled={loading} className="input-base resize-none border-0 border-b focus:border-b-2 rounded-none px-1" style={{ minHeight: '40px', maxHeight: '120px' }}/>
          <button onClick={handleSend} disabled={loading || !input.trim()} className="btn-primary p-2 shrink-0" aria-label="Enviar mensagem">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}