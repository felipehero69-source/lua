import { createClient } from '@/utils/supabase/server'
import { signOut } from './actions'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
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
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--foreground)', marginBottom: '0.2rem', fontWeight: 600 }}>Seu Perfil</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Gerencie suas informações e da conta.</p>
      </header>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '1rem', fontWeight: 600 }}>👤 Seus Dados</h2>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nome</span>
          <p style={{ fontSize: '1rem', margin: '4px 0 0 0' }}>{user.user_metadata?.name || 'Mãe'}</p>
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>E-mail</span>
          <p style={{ fontSize: '1rem', margin: '4px 0 0 0' }}>{user.email}</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '1rem', fontWeight: 600 }}>👶 Dados do Bebê</h2>
        {baby ? (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nome</span>
              <p style={{ fontSize: '1rem', margin: '4px 0 0 0' }}>{baby.name}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Data de Nascimento</span>
              <p style={{ fontSize: '1rem', margin: '4px 0 0 0' }}>
                {new Date(baby.birth_date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nenhum bebê cadastrado.</p>
        )}
      </div>

      <form action={signOut}>
        <button type="submit" className="glass-panel" style={{ 
          width: '100%', 
          padding: '16px', 
          background: 'rgba(239, 68, 68, 0.1)', 
          color: '#ef4444', 
          border: '1px solid rgba(239, 68, 68, 0.2)',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          Sair do Aplicativo
        </button>
      </form>
    </div>
  )
}
