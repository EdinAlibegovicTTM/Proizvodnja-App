import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock data za development kada Supabase nije konfigurisan
export const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      // Mock login za testiranje
      if (credentials.email === 'admin@test.com' && credentials.password === 'AsasE0111-') {
        return {
          data: {
            user: { id: '1', email: 'admin@test.com' },
            session: { access_token: 'mock-token' }
          },
          error: null
        }
      }
      return { data: { user: null, session: null }, error: { message: 'Invalid credentials' } }
    },
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => ({
      data: { subscription: { unsubscribe: () => {} } }
    })
  },
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          if (table === 'users' && value === 'admin@test.com') {
            return {
              data: {
                username: 'admin',
                role: 'admin',
                permissions: ['all']
              },
              error: null
            }
          }
          return { data: null, error: null }
        }
      }),
      order: (column: string, options: any) => {
        // Mock data za različite tabele
        const mockData: any = {
          otpremnice: [
            {
              id: '1',
              brojOtpremnice: 'OTP-2024-001',
              kupac: 'Test Kupac',
              datum: '2024-01-15',
              ukupanIznos: 15420.5,
              depozit: 1000,
              zaUplatu: 14420.5,
              preuzeo: 'Test Radnik',
              prevoznik: 'Test Prevoz',
              statusNaplate: 'isporučeno-nenaplaćeno'
            }
          ],
          dorada: [
            {
              id: '1',
              masina: 'CML',
              radnik: 'Ana Jovanović',
              novi_paket: 'DOR-2024-001',
              status: 'u-toku',
              datum: '2024-01-15'
            }
          ],
          trupci: [
            {
              id: 1,
              qrKod: 'QR-TRUPAC-001',
              brojPlocice: 'PL-001',
              bojaPlocice: 'plava',
              klasaTrupca: 'A',
              duzinaTrupca: 300,
              precnikTrupca: 25,
              m3: 0.147,
              datumPrijema: new Date('2024-01-15'),
              sumarija: 'Test Šumarija',
              status: 'na-stanju'
            }
          ]
        }
        return Promise.resolve({ data: mockData[table] || [], error: null })
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ error: null })
    }),
    insert: (data: any) => Promise.resolve({ error: null })
  })
} 