const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: users } = await supabase.from('users').select('*');
  console.log('Users:', users);
  
  const { data: babies, error } = await supabase.from('babies').select('*');
  if (error) console.error(error);
  console.log('Babies:', babies);
}

check();
