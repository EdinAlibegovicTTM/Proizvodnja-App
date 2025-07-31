import { supabase, mockSupabase } from './supabase'

// Hook koji koristi mock Supabase kada pravi nije konfigurisan
export function useSupabase() {
  // Za development, uvijek koristi mock Supabase
  // U produkciji, koristi pravi Supabase ako su environment varijable postavljene
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL ||
                       process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://mock.supabase.co'
  
  const client = isDevelopment ? mockSupabase : supabase
  
  // Debug log
  if (typeof window !== 'undefined') {
    console.log('Using Supabase:', isDevelopment ? 'Mock' : 'Real')
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
  }
  
  return client
} 