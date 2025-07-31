import { supabase, mockSupabase } from './supabase'

// Hook koji koristi mock Supabase kada pravi nije konfigurisan
export function useSupabase() {
  // Provjeri da li su environment varijable postavljene
  const hasRealSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://mock.supabase.co' &&
                         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
                         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'mock-key'
  
  const client = hasRealSupabase ? supabase : mockSupabase
  
  // Debug log
  if (typeof window !== 'undefined') {
    console.log('Using Supabase:', hasRealSupabase ? 'Real' : 'Mock')
  }
  
  return client
} 