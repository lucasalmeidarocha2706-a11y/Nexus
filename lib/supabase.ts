// Supabase client placeholder - ready for integration
// To connect, install @supabase/supabase-js and add your env vars:
// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Uncomment and configure when ready:
// import { createClient } from '@supabase/supabase-js'
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  completed: boolean
  created_at: string
  updated_at: string
}

// Mock user for development
export const mockUser: User = {
  id: "1",
  email: "usuario@exemplo.com",
  name: "Carlos Silva",
  avatar_url: undefined,
}
