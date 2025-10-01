-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for project status
CREATE TYPE project_status AS ENUM ('planning', 'active', 'completed', 'cancelled');

-- Create enum for income transaction type
CREATE TYPE transaction_type AS ENUM ('user', 'city', 'platform');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  resources TEXT[] DEFAULT '{}',
  bio TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'planning',
  category TEXT NOT NULL,
  location TEXT,
  required_skills TEXT[] DEFAULT '{}',
  required_resources TEXT[] DEFAULT '{}',
  estimated_budget DECIMAL(10,2),
  actual_budget DECIMAL(10,2) DEFAULT 0,
  total_income DECIMAL(10,2) DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create project_members table
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  contribution_percentage DECIMAL(5,2) DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Create income_transactions table
CREATE TABLE public.income_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type transaction_type NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create city_development_funds table
CREATE TABLE public.city_development_funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  allocated_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  available_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create city_projects table
CREATE TABLE public.city_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES public.city_development_funds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  requested_amount DECIMAL(10,2) NOT NULL,
  allocated_amount DECIMAL(10,2) DEFAULT 0,
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_project_id UUID NOT NULL REFERENCES public.city_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(city_project_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_development_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view all projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Users can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Project creators can update their projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = creator_id);

-- Project members policies
CREATE POLICY "Users can view project members"
  ON public.project_members FOR SELECT
  USING (true);

CREATE POLICY "Project creators can add members"
  ON public.project_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id AND creator_id = auth.uid()
    )
  );

-- Income transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.income_transactions FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "System can insert transactions"
  ON public.income_transactions FOR INSERT
  WITH CHECK (true);

-- City development funds policies
CREATE POLICY "Everyone can view city funds"
  ON public.city_development_funds FOR SELECT
  USING (true);

-- City projects policies
CREATE POLICY "Everyone can view city projects"
  ON public.city_projects FOR SELECT
  USING (true);

-- Votes policies
CREATE POLICY "Users can view all votes"
  ON public.votes FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own votes"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.email
  );
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_city_projects_updated_at
  BEFORE UPDATE ON public.city_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();