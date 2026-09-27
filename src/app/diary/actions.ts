'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSleepLog(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Pegar o ID do bebê (assumindo que a mãe tem apenas 1 bebê no momento)
  const { data: baby } = await supabase
    .from('babies')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!baby) {
    throw new Error('Baby not found')
  }

  const type = formData.get('type') as string // 'nap' ou 'night'
  const startedAt = formData.get('startedAt') as string
  const endedAt = formData.get('endedAt') as string
  const quality = formData.get('quality') as string

  // Validar campos
  if (!type || !startedAt) {
    throw new Error('Missing required fields')
  }

  // Inserir registro
  const { error } = await supabase
    .from('sleep_logs')
    .insert({
      baby_id: baby.id,
      type: type,
      started_at: new Date(startedAt).toISOString(),
      ended_at: endedAt ? new Date(endedAt).toISOString() : null,
      quality: quality || null
    })

  if (error) {
    console.error('Error inserting sleep log:', error)
    throw new Error('Database error')
  }

  revalidatePath('/diary')
  revalidatePath('/dashboard')
}
