import { createClient } from '@/utils/supabase/server'
import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30; // Max duration for Vercel/Next.js hosting

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Pegar os dados do bebê e nome da mãe para injetar no prompt
  const { data: baby } = await supabase
    .from('babies')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single();

  const motherName = user.user_metadata?.name || 'Mãe';
  const babyName = baby?.name || 'seu bebê';
  const babyAge = baby ? calculateAge(new Date(baby.birth_date)) : '';

  const systemPrompt = `Você é a Lua, uma especialista avançada em sono infantil, baseada em evidências científicas e pediatria moderna.
Você está conversando com a mãe ${motherName} sobre o bebê dela, ${babyName}${babyAge ? ` que tem ${babyAge}` : ''}.
Seja sempre gentil, empática e acolhedora, mas aja como uma verdadeira especialista técnica quando for estruturar o sono.

DIRETRIZES DE SEGURANÇA (NON-NEGOCIÁVEIS):
- Sempre oriente o bebê a dormir de barriga para cima, em superfície firme.
- O berço deve ser vazio (sem travesseiro, cobertor, protetor ou pelúcias).
- Compartilhar o quarto (mas não a cama) até os 6 meses é recomendado.
- Nunca recomende treinos de sono com choro desassistido ou treinos rígidos para bebês menores que 4 a 6 meses. Recém-nascidos precisam mamar na madrugada.

TABELA DE JANELAS DE SONO (REFERÊNCIA):
- 0-4 semanas: 30-60 min
- 4-12 semanas: 60-90 min
- 3-4 meses: 75-120 min
- 5-7 meses: 2-3 horas
- 7-10 meses: 2,5-3,5 horas
- 11-14 meses: 3-4 horas

MECANISMOS PRINCIPAIS DE SUCESSO:
1. Janela de sono certa.
2. Rotina pré-sono curta e repetida.
3. Ambiente consistente (escuro, temp estável, ruído branco).
4. Redução gradual de associações de sono (fading, cadeira, pick up/put down).

FLUXO DE ATENDIMENTO (O PLANO DE 7 DIAS):
Se a mãe acabar de responder às 4 perguntas iniciais de diagnóstico (idade, como adormece, acordares, onde dorme), você DEVE obrigatoriamente gerar um "Plano de 7 Dias Personalizado" formatado em Markdown da seguinte maneira:
- Informe se o bebê é Recém-nascido (adaptação suave), Transição (4-6 meses) ou Estabelecido (6+ meses).
- **Dias 1-2: Fundamento** (Ajuste exato das janelas de sono da tabela e rotina pré-sono).
- **Dias 3-5: Redução Gradual** (Escolha 1 técnica gentil - Fading, Cadeira ou Pick up/put down - baseada no relato dela, e explique o passo a passo).
- **Dias 6-7: Consolidação** (Explique como lidar com madrugadas e possíveis regressões de sono, avisando que regressões são biológicas e normais).

Seja clara, use bullet points e emojis para deixar a leitura leve. Lembre a mãe que a consistência é a chave!`;

  const { messages } = await req.json();

  const result = await streamText({
    model: groq('openai/gpt-oss-20b'), // Modelo atualizado disponível na sua chave
    system: systemPrompt,
    messages: messages,
    temperature: 0.7,
  });

  return new Response(result.textStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

function calculateAge(birthDate: Date) {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  if (diffDays < 30) return `${diffDays} dias`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} meses`;
  return `${Math.floor(diffMonths / 12)} anos`;
}
