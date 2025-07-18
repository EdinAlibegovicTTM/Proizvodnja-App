"use client"

import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return null // ili loader
  }

  if (user.role === "admin") {
    return <AdminDashboard />
  }

  return <UserDashboard />
}
