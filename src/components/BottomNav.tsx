'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Moon, MessageCircle, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const getIconStyle = (path: string) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    color: isActive(path) ? 'var(--primary)' : 'var(--text-muted)',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    transform: isActive(path) ? 'translateY(-2px)' : 'none'
  })

  return (
    <nav className="glass-panel" style={{
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      right: '16px',
      height: '65px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 10px',
      zIndex: 50,
      borderRadius: '32px'
    }}>
      <Link href="/dashboard" style={getIconStyle('/dashboard')}>
        <Home size={22} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
        <span style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: isActive('/dashboard') ? 600 : 400 }}>Início</span>
      </Link>
      
      <Link href="/diary" style={getIconStyle('/diary')}>
        <Moon size={22} strokeWidth={isActive('/diary') ? 2.5 : 2} />
        <span style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: isActive('/diary') ? 600 : 400 }}>Diário</span>
      </Link>
      
      <Link href="/chat" style={getIconStyle('/chat')}>
        <MessageCircle size={22} strokeWidth={isActive('/chat') ? 2.5 : 2} />
        <span style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: isActive('/chat') ? 600 : 400 }}>Lua Chat</span>
      </Link>
      
      <Link href="/profile" style={getIconStyle('/profile')}>
        <User size={22} strokeWidth={isActive('/profile') ? 2.5 : 2} />
        <span style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: isActive('/profile') ? 600 : 400 }}>Perfil</span>
      </Link>
    </nav>
  )
}
