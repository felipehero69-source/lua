-- ==========================================
-- LUA SLEEP ASSISTANT - SUPABASE SCHEMA
-- ==========================================

-- Habilitar a extensão pgvector para busca semântica (RAG)
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Tabela de Perfis de Usuários (Estendendo a autenticação do Supabase)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Bebês
CREATE TABLE public.babies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    sex TEXT CHECK (sex IN ('M', 'F', 'OUTRO')),
    birth_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Registro de Sono (Diário)
CREATE TABLE public.sleep_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES public.babies(id) ON DELETE CASCADE NOT NULL,
    type TEXT CHECK (type IN ('night', 'nap')) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    quality TEXT CHECK (quality IN ('excellent', 'good', 'fair', 'poor', 'terrible')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Despertares Noturnos
CREATE TABLE public.night_wakings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES public.babies(id) ON DELETE CASCADE NOT NULL,
    sleep_log_id UUID REFERENCES public.sleep_logs(id) ON DELETE CASCADE,
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    crying_level INTEGER CHECK (crying_level >= 1 AND crying_level <= 5),
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Rotinas
CREATE TABLE public.routines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    baby_id UUID REFERENCES public.babies(id) ON DELETE CASCADE NOT NULL,
    routine_name TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela Base de Conhecimento (Artigos)
CREATE TABLE public.knowledge_articles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    age_min_months INTEGER,
    age_max_months INTEGER,
    source TEXT,
    source_url TEXT,
    scientific_reference TEXT,
    is_safety_critical BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    embedding vector(768), -- Assumindo modelo de embedding padrão de 768 dimensões
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Histórico de Conversas
CREATE TABLE public.chat_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    baby_id UUID REFERENCES public.babies(id) ON DELETE SET NULL,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Mensagens do Chat
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.night_wakings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para 'users'
CREATE POLICY "Users can view their own profile." ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

-- Políticas para 'babies'
CREATE POLICY "Users can view their own babies." ON public.babies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own babies." ON public.babies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own babies." ON public.babies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own babies." ON public.babies FOR DELETE USING (auth.uid() = user_id);

-- Políticas para 'sleep_logs'
CREATE POLICY "Users can view their babies sleep logs." ON public.sleep_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.babies WHERE id = sleep_logs.baby_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert sleep logs for their babies." ON public.sleep_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.babies WHERE id = sleep_logs.baby_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their babies sleep logs." ON public.sleep_logs FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.babies WHERE id = sleep_logs.baby_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete their babies sleep logs." ON public.sleep_logs FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.babies WHERE id = sleep_logs.baby_id AND user_id = auth.uid())
);

-- Políticas para 'night_wakings'
CREATE POLICY "Users can view their babies night wakings." ON public.night_wakings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.babies WHERE id = night_wakings.baby_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert night wakings for their babies." ON public.night_wakings FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.babies WHERE id = night_wakings.baby_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their babies night wakings." ON public.night_wakings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.babies WHERE id = night_wakings.baby_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete their babies night wakings." ON public.night_wakings FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.babies WHERE id = night_wakings.baby_id AND user_id = auth.uid())
);

-- Políticas para 'routines'
CREATE POLICY "Users can view their babies routines." ON public.routines FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.babies WHERE id = routines.baby_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert routines for their babies." ON public.routines FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.babies WHERE id = routines.baby_id AND user_id = auth.uid())
);
CREATE POLICY "Users can update their babies routines." ON public.routines FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.babies WHERE id = routines.baby_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete their babies routines." ON public.routines FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.babies WHERE id = routines.baby_id AND user_id = auth.uid())
);

-- Políticas para 'chat_conversations'
CREATE POLICY "Users can view their own conversations." ON public.chat_conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own conversations." ON public.chat_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own conversations." ON public.chat_conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own conversations." ON public.chat_conversations FOR DELETE USING (auth.uid() = user_id);

-- Políticas para 'chat_messages'
CREATE POLICY "Users can view their own messages." ON public.chat_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = chat_messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert their own messages." ON public.chat_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = chat_messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can delete their own messages." ON public.chat_messages FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.chat_conversations WHERE id = chat_messages.conversation_id AND user_id = auth.uid())
);

-- Políticas para 'knowledge_articles'
-- Todos os usuários autenticados podem LER os artigos
CREATE POLICY "Authenticated users can read articles." ON public.knowledge_articles FOR SELECT TO authenticated USING (true);
-- O service_role (backend) irá inserir/editar ignorando RLS.

-- ==========================================
-- TRIGGERS DE ATUALIZAÇÃO
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER babies_updated_at BEFORE UPDATE ON public.babies FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER knowledge_articles_updated_at BEFORE UPDATE ON public.knowledge_articles FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ==========================================
-- TRIGGER DE NOVO USUÁRIO (Supabase Auth)
-- ==========================================
-- Esta função cria um registro na tabela public.users automaticamente quando um usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Sem nome'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- FUNÇÃO DE BUSCA VETORIAL (RAG)
-- ==========================================
CREATE OR REPLACE FUNCTION match_articles (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  source text,
  scientific_reference text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    title,
    content,
    source,
    scientific_reference,
    1 - (knowledge_articles.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_articles
  WHERE active = true
  AND 1 - (knowledge_articles.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_articles.embedding <=> query_embedding
  LIMIT match_count;
$$;
