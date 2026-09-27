'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error.message)
    redirect(`/login?error=CredentialsError&message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // O Supabase Auth vai acionar o trigger e criar um registro na tabela public.users
  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error('Signup error:', error.message)
    redirect(`/login?error=SignUpError&message=${encodeURIComponent(error.message)}`)
  }

  // Se o Supabase exigir confirmação de e-mail (configuração padrão)
  if (authData.user && !authData.session) {
    redirect('/login?error=SignUpError&message=Por%20favor%2C%20verifique%20a%20caixa%20de%20entrada%20do%20seu%20e-mail%20para%20confirmar%20a%20conta.')
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}
