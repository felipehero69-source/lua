'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function submitOnboarding(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  const motherName = formData.get('motherName') as string
  const babyName = formData.get('babyName') as string
  const babySex = formData.get('babySex') as string
  const babyBirthDate = formData.get('babyBirthDate') as string

  // Atualizar o nome da mãe
  const { error: userError } = await supabase
    .from('users')
    .update({ name: motherName })
    .eq('id', user.id)

  if (userError) {
    console.error('Erro ao atualizar usuário:', userError)
    redirect('/onboarding?error=UserUpdateFailed')
  }

  // Cadastrar o bebê
  const { error: babyError } = await supabase
    .from('babies')
    .insert({
      user_id: user.id,
      name: babyName,
      sex: babySex,
      birth_date: babyBirthDate
    })

  if (babyError) {
    console.error('Erro ao cadastrar bebê:', babyError)
    redirect('/onboarding?error=BabyInsertFailed')
  }

  // Limpar o cache antes de redirecionar para que o dashboard enxergue o novo bebê
  revalidatePath('/', 'layout')
  
  redirect('/dashboard')
}
