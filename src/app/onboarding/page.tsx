import { submitOnboarding } from './actions'

export default function OnboardingPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--background)',
      color: 'var(--foreground)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '500px', width: '100%', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#F7F3EA' }}>Oi! Eu sou a Lua 🌙</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6', color: '#D8BC70' }}>
          Vou estar aqui para ajudar você a entender melhor o sono do seu bebê e construir uma rotina mais tranquila. Antes de começarmos, quero conhecer vocês.
        </p>

        <form action={submitOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#56629A', padding: '2rem', borderRadius: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="motherName" style={{ fontWeight: 'bold' }}>Como você se chama?</label>
            <input type="text" id="motherName" name="motherName" required style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }} placeholder="Seu nome" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="babyName" style={{ fontWeight: 'bold' }}>Qual o nome do seu bebê?</label>
            <input type="text" id="babyName" name="babyName" required style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }} placeholder="Nome do bebê" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="babySex" style={{ fontWeight: 'bold' }}>Sexo do bebê</label>
            <select id="babySex" name="babySex" required style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem', background: '#fff' }}>
              <option value="M">Menino</option>
              <option value="F">Menina</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="babyBirthDate" style={{ fontWeight: 'bold' }}>Data de nascimento</label>
            <input type="date" id="babyBirthDate" name="babyBirthDate" required style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }} />
          </div>

          <button type="submit" style={{
            background: '#1E2352',
            color: '#F7F3EA',
            padding: '14px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            marginTop: '1rem'
          }}>
            Salvar e Continuar
          </button>
        </form>
      </div>
    </div>
  )
}
