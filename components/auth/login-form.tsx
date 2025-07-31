"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useSupabase } from "@/lib/use-supabase"
import { useAuth } from "@/components/auth-provider"
import type { ButtonProps } from "@/components/ui/button"
import { logActivityToSupabase } from "@/lib/utils"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()
  const supabase = useSupabase()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    console.log('Login attempt:', { username, password })
    console.log('Using Supabase client type:', typeof supabase)
    console.log('Supabase client:', supabase)

    // Direktan test mock Supabase
    if (username === 'admin@test.com' && password === 'AsasE0111-') {
      console.log('Using mock login for admin@test.com')
      try {
        // Simuliraj uspješan login
        const mockUserData = {
          username: 'admin',
          role: 'admin',
          permissions: ['all']
        }
        
        login(mockUserData as any)
        console.log('Mock login successful')
        router.push("/dashboard")
        return
      } catch (err) {
        console.error('Mock login error:', err)
        setError("Greška pri prijavljivanju")
        setIsLoading(false)
        return
      }
    }

    try {
      // Prava autentikacija preko Supabase
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      })
      console.log('Login result:', { data, error: loginError })
      
      if (loginError) {
        setError("Neispravno korisničko ime ili lozinka")
        setIsLoading(false)
        return
      }
      // Povuci dodatne podatke o korisniku (role, permissions)
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("username, role, permissions")
        .eq("email", username)
        .single()
      console.log('User data result:', { userData, error: userError })
      
      if (userError || !userData) {
        setError("Nije moguće dohvatiti podatke o korisniku")
        setIsLoading(false)
        return
      }
      login(userData as any)
      // Logovanje aktivnosti
      await logActivityToSupabase({
        action: "login",
        user: { username: userData.username },
        details: { email: username, time: new Date().toISOString() },
      })
      router.push("/dashboard")
    } catch (err) {
      console.error('Login error:', err)
      setError("Greška pri prijavljivanju")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogIn className="h-5 w-5" />
          Prijavite se
        </CardTitle>
        <CardDescription>Unesite vaše podatke za pristup sistemu</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Email</Label>
            <Input id="username" name="username" type="text" placeholder="Unesite email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Unesite lozinku"
                required
              />
              <Button
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Prijavljivanje..." : "Prijavite se"}
          </Button>
        </form>

        <div className="mt-6 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Demo pristup:</p>
          <p>Admin: admin@test.com / AsasE0111-</p>
          <p>Korisnik: korisnik@test.com / korisnik123</p>
        </div>
      </CardContent>
    </Card>
  )
}
