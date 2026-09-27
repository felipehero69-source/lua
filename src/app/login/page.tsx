import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string, message?: string }>
}) {
  const resolvedParams = await searchParams;
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <div className="glass-panel animate-in" style={{
        padding: '2.5rem 2rem',
        width: '100%',
        maxWidth: '400px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #D6DFEF 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '2rem',
            margin: '0 auto 1.2rem auto',
            boxShadow: '0 4px 12px rgba(139, 155, 180, 0.3)'
          }}>
            🌙
          </div>
          <h1 style={{ color: 'var(--foreground)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>Lua</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Acesse sua conta para começar</p>
        </div>

        {resolvedParams.error === 'CredentialsError' && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {resolvedParams.message ? `Erro ao entrar: ${resolvedParams.message}` : 'Erro ao entrar. Verifique seu e-mail e senha.'}
          </div>
        )}
        {resolvedParams.error === 'SignUpError' && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
            {resolvedParams.message ? `Erro ao criar conta: ${resolvedParams.message}` : 'Erro ao criar conta. Esse e-mail já está em uso ou a senha é muito fraca.'}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--foreground)', fontWeight: 500, display: 'block', marginBottom: '8px' }}>E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="glass-input"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ fontSize: '0.9rem', color: 'var(--foreground)', fontWeight: 500, display: 'block', marginBottom: '8px' }}>Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="glass-input"
              placeholder="••••••••"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button
              formAction={login}
              className="btn-primary"
              style={{ flex: 1, background: '#FFFFFF', color: 'var(--foreground)', border: '1px solid rgba(139, 155, 180, 0.2)', boxShadow: '0 2px 8px rgba(139, 155, 180, 0.1)' }}
            >
              Entrar
            </button>
            <button
              formAction={signup}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
