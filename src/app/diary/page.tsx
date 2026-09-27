'use client'

import { useState } from 'react'

export default function DiaryPage() {
  const [sleepType, setSleepType] = useState('soneca')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Salvo: ${sleepType} das ${startTime} às ${endTime}`)
  }

  return (
    <div className="animate-in" style={{ padding: '2rem 1.5rem', color: 'var(--foreground)' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--foreground)', marginBottom: '0.2rem', fontWeight: 600 }}>Diário do Sono</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Registre as sonecas e o sono noturno.</p>
      </header>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--foreground)', fontSize: '0.9rem', fontWeight: 500 }}>
            Tipo de Sono
          </label>
          <select 
            className="glass-input"
            value={sleepType} 
            onChange={e => setSleepType(e.target.value)}
          >
            <option value="soneca" style={{ color: '#000' }}>Soneca (Dia)</option>
            <option value="noturno" style={{ color: '#000' }}>Sono Noturno</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--foreground)', fontSize: '0.9rem', fontWeight: 500 }}>
            Início
          </label>
          <input 
            type="time" 
            className="glass-input"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            required
            style={{ colorScheme: 'dark' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--foreground)', fontSize: '0.9rem', fontWeight: 500 }}>
            Fim
          </label>
          <input 
            type="time" 
            className="glass-input"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            required
            style={{ colorScheme: 'dark' }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          Salvar Registro
        </button>
      </form>
    </div>
  )
}
