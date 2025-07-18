"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Search, User, Settings, LogOut, Palette, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [notifications] = useState(3)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const themes = [
    { name: "Svijetla", value: "light", icon: Sun },
    { name: "Tamna", value: "dark", icon: Moon },
    { name: "Sistem", value: "system", icon: Monitor },
    { name: "WhatsApp", value: "whatsapp", icon: Palette },
    { name: "Industrijska", value: "industrial", icon: Palette },
    { name: "Prirodna", value: "nature", icon: Palette },
    { name: "Moderna", value: "modern", icon: Palette },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo i naslov */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PP</span>
              </div>
              <div>
                <h1 className="font-semibold text-lg">Proizvodnja Premium</h1>
                <p className="text-xs text-muted-foreground">v1.0.0</p>
              </div>
            </div>
          </div>

          {/* Pretraga */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pretražite..." className="pl-10" />
            </div>
          </div>

          {/* Akcije */}
          <div className="flex items-center gap-4">
            {/* Notifikacije */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* Tema */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Izaberite temu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {themes.map((themeOption) => (
                  <DropdownMenuItem
                    key={themeOption.value}
                    onClick={() => setTheme(themeOption.value)}
                    className="flex items-center gap-2"
                  >
                    <themeOption.icon className="h-4 w-4" />
                    {themeOption.name}
                    {theme === themeOption.value && (
                      <Badge variant="secondary" className="ml-auto">
                        Aktivna
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Korisnički meni */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">{user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Podešavanja
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Odjavi se
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
