import BottomNav from '@/components/BottomNav'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ paddingBottom: '80px', minHeight: '100vh', background: 'var(--background)' }}>
      {children}
      <BottomNav />
    </div>
  )
}
