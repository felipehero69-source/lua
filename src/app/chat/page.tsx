'use client';

import { useEffect, useRef, useState } from 'react';

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome-msg',
  role: 'assistant',
  content: 'Olá! Sou a Lua 🌙, sua especialista em sono infantil. Para eu criar o seu **Plano Personalizado de 7 Dias**, preciso te conhecer melhor. Por favor, me responda essas 4 perguntinhas rápidas:\n\n1️⃣ Qual a idade exata do bebê?\n2️⃣ Como ele costuma adormecer hoje? (ex: mamando, no colo, balançando, no berço sozinho)\n3️⃣ Quantas vezes ele costuma acordar de madrugada?\n4️⃣ Onde ele dorme? (ex: berço no próprio quarto, berço no quarto dos pais, cama compartilhada)\n\nPode me responder tudo em uma mensagem só!'
};

export default function ChatPage() {
  const [messages, setMessages] = useState<{id: string, role: string, content: string}[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.body) throw new Error('Falha ao conectar com a Lua.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageContent = '';
      const aiMessageId = (Date.now() + 1).toString();
      
      // Adiciona a mensagem vazia da IA que será preenchida
      setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        aiMessageContent += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = aiMessageContent;
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', color: 'var(--foreground)' }}>
      {/* Cabeçalho do Chat */}
      <header className="glass-panel" style={{ 
        padding: '1rem 1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        zIndex: 10,
        margin: '1rem 1rem 0 1rem',
        borderRadius: '24px'
      }}>
        <div style={{ 
          width: '45px', 
          height: '45px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #B89A4B 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '1.5rem',
          boxShadow: '0 4px 12px rgba(216, 188, 112, 0.4)'
        }}>
          🌙
        </div>
        <div>
          <h1 style={{ fontSize: '1.2rem', color: 'var(--foreground)', margin: 0, fontWeight: 600 }}>Lua</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Sua especialista em sono</p>
        </div>
      </header>

      {/* Área de Mensagens */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {messages.map(m => (
          <div key={m.id} className="animate-in" style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            background: m.role === 'user' ? 'var(--primary)' : '#FFFFFF',
            backdropFilter: m.role === 'user' ? 'none' : 'none',
            color: m.role === 'user' ? '#FFFFFF' : 'var(--foreground)',
            padding: '14px 18px',
            borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
            maxWidth: '85%',
            lineHeight: '1.5',
            fontSize: '0.95rem',
            border: m.role === 'user' ? 'none' : '1px solid rgba(139, 155, 180, 0.15)',
            boxShadow: m.role === 'user' ? '0 4px 12px rgba(139, 155, 180, 0.25)' : '0 2px 8px rgba(139, 155, 180, 0.08)',
            whiteSpace: 'pre-wrap'
          }}>
            {m.content}
          </div>
        ))}
        
        {isLoading && (
          <div className="animate-in" style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
            A Lua está digitando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Campo de Digitação */}
      <footer style={{ padding: '1rem', background: 'transparent' }}>
        <form onSubmit={handleSubmit} className="glass-panel" style={{ 
          display: 'flex', 
          gap: '0.8rem', 
          padding: '0.6rem',
          borderRadius: '30px',
          background: 'rgba(255, 255, 255, 0.95)'
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mensagem para a Lua..."
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '24px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--foreground)',
              fontSize: '0.95rem'
            }}
          />
          <button type="submit" disabled={isLoading || !input.trim()} style={{
            background: isLoading || !input.trim() ? '#E2E8F0' : 'var(--primary)',
            color: isLoading || !input.trim() ? '#A0AABF' : '#FFFFFF',
            border: 'none',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isLoading || !input.trim() ? 'none' : '0 4px 12px rgba(139, 155, 180, 0.4)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
}
