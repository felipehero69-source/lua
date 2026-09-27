import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  const { data: baby } = await supabase
    .from('babies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="animate-in" style={{ padding: '2rem 1.5rem', color: 'var(--foreground)' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--foreground)', marginBottom: '0.2rem', fontWeight: 600 }}>Olá, {user.user_metadata?.name || 'Mãe'}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Como foi a noite {baby ? `do ${baby.name}` : 'do seu bebê'}?</p>
      </header>

      <section className="glass-panel" style={{ 
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--primary)' }}>🌙</span> Resumo de Hoje
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            padding: '1rem', 
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Sonecas</span>
            <strong style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>2</strong>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            padding: '1rem', 
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Tempo Total</span>
            <strong style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>1h 45m</strong>
          </div>
        </div>
      </section>

      <section className="glass-panel" style={{ 
        padding: '1.5rem',
        borderLeft: '4px solid var(--primary)'
      }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '0.8rem', fontWeight: 600 }}>✨ Dica da Lua</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
          Para a idade atual {baby ? `do ${baby.name}` : 'do seu bebê'}, a janela de sono ideal costuma ser entre 2h e 2h30. Fique atenta aos sinais de sono!
        </p>
      </section>
    </div>
  )
}
