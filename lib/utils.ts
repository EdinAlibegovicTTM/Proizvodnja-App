import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/lib/supabase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatDateTime(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function generateQRCode(data: string) {
  // U stvarnoj aplikaciji, koristiti pravu QR biblioteku
  return `QR-${data}-${Date.now()}`
}

export function calculateVolume(length: number, diameter: number) {
  // Računanje zapremine trupca u m³
  const radius = diameter / 2 / 100 // konvertuj cm u m
  const lengthInM = length / 100 // konvertuj cm u m
  return Math.PI * Math.pow(radius, 2) * lengthInM
}

export function logActivity(action: string, user: string, details?: any) {
  // Funkcija za logovanje aktivnosti
  const activity = {
    timestamp: new Date().toISOString(),
    action,
    user,
    details,
    location: "N/A", // U stvarnoj aplikaciji, dobiti geolokaciju
  }

  console.log("Activity logged:", activity)
  // U stvarnoj aplikaciji, poslati na server
}

export async function logActivityToSupabase({ action, user, details, ip, location }: {
  action: string
  user: { id?: number, username?: string } | string
  details?: any
  ip?: string
  location?: string
}) {
  let user_id = null
  let username = null
  if (typeof user === "object") {
    user_id = user.id || null
    username = user.username || null
  } else {
    username = user
  }
  await supabase.from("audit_log").insert({
    action,
    user_id,
    username,
    details,
    ip,
    location
  })
}
