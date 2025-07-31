import { supabase, mockSupabase } from './supabase'

// Hook koji koristi mock Supabase kada pravi nije konfigurisan
export function useSupabase() {
  const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock.supabase.co'
  
  return isMock ? mockSupabase : supabase
} 