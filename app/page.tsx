import { LoginForm } from "@/components/auth/login-form"

export default function HomePage() {
  // U stvarnoj aplikaciji, provjeriti autentifikaciju
  // redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Proizvodnja Premium</h1>
          <p className="text-muted-foreground">Napredni sistem za upravljanje proizvodnjom</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
