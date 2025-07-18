"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Settings,
  Factory,
  CreditCard,
  BarChart3,
  Package,
  FileText,
  QrCode,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { DashboardHeader } from "./dashboard-header"
import { StatsCard } from "./stats-card"
import { QuickActions } from "./quick-actions"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { logActivityToSupabase } from "@/lib/utils"
import { toast } from "sonner"
import { exportToPDF, exportToExcel, printTable } from '@/lib/export-helpers'
import PrintSettings from '@/components/admin/print-settings'
import AdvancedReports from '@/components/admin/advanced-reports'
import AnalyticsDashboard from '@/components/admin/analytics-dashboard'
import SystemConfig from '@/components/admin/system-config'
import AIIntegration from '@/components/admin/ai-integration'
import AutomationWorkflows from '@/components/admin/automation-workflows'
import DataMigration from '@/components/admin/data-migration'

export function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (!user || user.role !== "admin") {
    return null // ili prikaz "Nemate pristup ovoj stranici"
  }

  const [selectedModule, setSelectedModule] = useState("overview")
  const [audit, setAudit] = useState<any[]>([])
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditError, setAuditError] = useState("")
  const [auditUser, setAuditUser] = useState("")
  const [auditAction, setAuditAction] = useState("")
  const [reports, setReports] = useState<any>(null)
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsError, setReportsError] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState("")
  const [editUser, setEditUser] = useState<any>(null)
  const [editRole, setEditRole] = useState("")
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [addEmail, setAddEmail] = useState("")
  const [addUsername, setAddUsername] = useState("")
  const [addPassword, setAddPassword] = useState("")
  const [addRole, setAddRole] = useState("user")
  const [addPermissions, setAddPermissions] = useState<string[]>([])
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState("")
  const [userSearch, setUserSearch] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("")
  const [userStatusFilter, setUserStatusFilter] = useState("")
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('exportSettings') || '{}')
      } catch { return {} }
    }
    return {}
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '')
  const [header, setHeader] = useState(settings.header || '')
  const [footer, setFooter] = useState(settings.footer || '')
  const [printer, setPrinter] = useState(settings.printer || '')

  const handleSaveSettings = () => {
    const newSettings = { logoUrl, header, footer, printer }
    setSettings(newSettings)
    localStorage.setItem('exportSettings', JSON.stringify(newSettings))
    alert('Postavke su spremljene!')
  }
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = ev => setLogoUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const filteredUsers = users.filter((u: any) => {
    const search = userSearch.toLowerCase()
    const matchesSearch =
      u.username?.toLowerCase().includes(search) ||
      u.email?.toLowerCase().includes(search)
    const matchesRole = userRoleFilter ? u.role === userRoleFilter : true
    const matchesStatus = userStatusFilter ? (userStatusFilter === "active" ? u.active : !u.active) : true
    return matchesSearch && matchesRole && matchesStatus
  })

  const allPermissions = [
    "ponude", "radni-nalozi", "pilana", "dorada", "prijem-trupaca", "blagajna", "izvještaji", "admin"
  ]

  const openEdit = (user: any) => {
    setEditUser(user)
    setEditRole(user.role)
    setEditPermissions(Array.isArray(user.permissions) ? user.permissions : (user.permissions ? [user.permissions] : []))
    setEditError("")
  }

  const handleEditSave = async () => {
    setEditLoading(true)
    const { error } = await supabase.from("users").update({
      role: editRole,
      permissions: editPermissions
    }).eq("id", editUser.id)
    if (error) {
      setEditError("Greška pri spremanju izmjena")
      setEditLoading(false)
      return
    }
    await logActivityToSupabase({
      action: "korisnik:izmjena",
      user: user?.username || "admin",
      details: { korisnik: editUser.username, role: editRole, permissions: editPermissions },
    })
    setEditLoading(false)
    setEditUser(null)
    setUsersLoading(true)
    supabase.from("users").select("id, username, email, role, permissions, active, created_at").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setUsersError("Greška pri dohvaćanju korisnika")
        setUsers(data || [])
        setUsersLoading(false)
      })
  }

  const openAdd = () => {
    setAddOpen(true)
    setAddEmail("")
    setAddUsername("")
    setAddPassword("")
    setAddRole("user")
    setAddPermissions([])
    setAddError("")
  }

  const handleAddSave = async () => {
    if (!addEmail || !addUsername || !addPassword) {
      setAddError("Sva polja su obavezna")
      return
    }
    setAddLoading(true)
    // Kreiraj korisnika u Supabase auth
    const { error: authError } = await supabase.auth.admin.createUser({
      email: addEmail,
      password: addPassword,
      email_confirm: true
    })
    if (authError) {
      setAddError("Greška pri kreiranju korisnika: " + authError.message)
      setAddLoading(false)
      return
    }
    // Upisi korisnika u users tabelu
    const { error } = await supabase.from("users").insert({
      email: addEmail,
      username: addUsername,
      role: addRole,
      permissions: addPermissions,
      active: true
    })
    if (error) {
      setAddError("Greška pri upisu korisnika: " + error.message)
      setAddLoading(false)
      return
    }
    await logActivityToSupabase({
      action: "korisnik:dodavanje",
      user: user?.username || "admin",
      details: { email: addEmail, username: addUsername, role: addRole, permissions: addPermissions },
    })
    setAddLoading(false)
    setAddOpen(false)
    setUsersLoading(true)
    supabase.from("users").select("id, username, email, role, permissions, active, created_at").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setUsersError("Greška pri dohvaćanju korisnika")
        setUsers(data || [])
        setUsersLoading(false)
      })
  }

  const handleToggleActive = async (userObj: any) => {
    const noviStatus = !userObj.active
    await supabase.from("users").update({ active: noviStatus }).eq("id", userObj.id)
    await logActivityToSupabase({
      action: noviStatus ? "korisnik:aktivacija" : "korisnik:deaktivacija",
      user: user?.username || "admin",
      details: { korisnik: userObj.username, email: userObj.email, noviStatus },
    })
    setUsersLoading(true)
    supabase.from("users").select("id, username, email, role, permissions, active, created_at").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setUsersError("Greška pri dohvaćanju korisnika")
        setUsers(data || [])
        setUsersLoading(false)
      })
  }

  const handleResetPassword = async (userObj: any) => {
    const { error } = await supabase.auth.admin.resetPasswordForEmail(userObj.email)
    if (error) {
      toast.error("Greška pri slanju emaila za reset lozinke: " + error.message)
    } else {
      toast.success("Email za reset lozinke poslan korisniku: " + userObj.email)
    }
  }

  useEffect(() => {
    if (selectedModule === "audit") {
      setAuditLoading(true)
      let query = supabase.from("audit_log").select("*", { count: "exact" }).order("timestamp", { ascending: false })
      if (auditUser) query = query.ilike("username", `%${auditUser}%`)
      if (auditAction) query = query.ilike("action", `%${auditAction}%`)
      query.then(({ data, error }) => {
        if (error) {
          setAuditError("Greška pri dohvaćanju aktivnosti")
          setAudit([])
        } else {
          setAudit(data || [])
          setAuditError("")
        }
        setAuditLoading(false)
      })
    }
  }, [selectedModule, auditUser, auditAction])

  useEffect(() => {
    if (selectedModule === "reports") {
      setReportsLoading(true)
      Promise.all([
        supabase.from("users").select("id", { count: "exact" }),
        supabase.from("ponude").select("id", { count: "exact" }),
        supabase.from("otpremnice").select("ukupanIznos", { count: "exact" }),
        supabase.from("radni_nalozi").select("id", { count: "exact" }),
      ]).then(([users, ponude, otpremnice, nalozi]) => {
        setReports({
          users: users.count || 0,
          ponude: ponude.count || 0,
          otpremnice: otpremnice.count || 0,
          promet: otpremnice.data ? otpremnice.data.reduce((sum, o) => sum + (o.ukupanIznos || 0), 0) : 0,
          nalozi: nalozi.count || 0,
        })
        setReportsError("")
        setReportsLoading(false)
      }).catch(() => {
        setReportsError("Greška pri dohvaćanju izvještaja")
        setReportsLoading(false)
      })
    }
  }, [selectedModule])

  useEffect(() => {
    if (selectedModule === "users") {
      setUsersLoading(true)
      supabase.from("users").select("id, username, email, role, permissions, active, created_at").order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) {
            setUsersError("Greška pri dohvaćanju korisnika")
            setUsers([])
          } else {
            setUsers(data || [])
            setUsersError("")
          }
          setUsersLoading(false)
        })
    }
  }, [selectedModule])

  const stats = [
    {
      title: "Aktivni Radni Nalozi",
      value: "24",
      change: "+12%",
      trend: "up" as const,
      icon: FileText,
      color: "blue" as const,
    },
    {
      title: "Dnevna Proizvodnja",
      value: "156 m³",
      change: "+8%",
      trend: "up" as const,
      icon: Factory,
      color: "green" as const,
    },
    {
      title: "Ponude na Čekanju",
      value: "7",
      change: "-3%",
      trend: "down" as const,
      icon: Package,
      color: "orange" as const,
    },
    {
      title: "Mjesečni Prihod",
      value: "€45,230",
      change: "+15%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "purple" as const,
    },
  ]

  const modules = [
    {
      id: "users",
      name: "Korisnici",
      icon: Users,
      description: "Upravljanje korisnicima i dozvolama",
      count: 12,
    },
    {
      id: "production",
      name: "Proizvodnja",
      icon: Factory,
      description: "Ponude, radni nalozi, pilana, dorada",
      count: 24,
    },
    {
      id: "treasury",
      name: "Blagajna",
      icon: CreditCard,
      description: "Finansijsko upravljanje",
      count: 8,
    },
    {
      id: "reports",
      name: "Izvještaji",
      icon: BarChart3,
      description: "Analitika i izvještaji",
      count: 15,
    },
    {
      id: "settings",
      name: "Podešavanja",
      icon: Settings,
      description: "Konfiguracija sistema",
      count: null,
    },
    {
      id: "audit",
      name: "Audit Trail",
      icon: BarChart3,
      description: "Log aktivnosti korisnika",
      count: null,
    },
  ]

  const userColumns = [
    'username',
    'email',
    'role',
    'permissions',
    'active',
  ]
  const userColumnLabels = [
    'Korisničko ime',
    'Email',
    'Uloga',
    'Dozvole',
    'Status',
  ]
  const handleExportUsersPDF = () => {
    exportToPDF({
      data: filteredUsers,
      columns: userColumns,
      fileName: 'korisnici.pdf',
      header: 'Izvještaj - Korisnici',
    })
  }
  const handleExportUsersExcel = () => {
    exportToExcel({
      data: filteredUsers,
      columns: userColumns,
      fileName: 'korisnici.xlsx',
    })
  }
  const handlePrintUsers = () => {
    printTable({
      data: filteredUsers,
      columns: userColumns,
      columnLabels: userColumnLabels,
      title: 'Korisnici'
    })
  }
  const handleExportReportsPDF = () => {
    if (!reports) return
    exportToPDF({
      data: [reports],
      columns: reportsColumns,
      fileName: 'izvjestaj.pdf',
      header: 'Izvještaj - Agregirani podaci',
    })
  }
  const handleExportReportsExcel = () => {
    if (!reports) return
    exportToExcel({
      data: [reports],
      columns: reportsColumns,
      fileName: 'izvjestaj.xlsx',
    })
  }
  const handlePrintReports = () => {
    if (!reports) return
    printTable({
      data: [reports],
      columns: reportsColumns,
      columnLabels: reportsColumnLabels,
      title: 'Izvještaji'
    })
  }

  const auditColumns = [
    'timestamp', 'username', 'action', 'details', 'ip', 'location'
  ]
  const auditColumnLabels = [
    'Vrijeme', 'Korisnik', 'Akcija', 'Detalji', 'IP', 'Lokacija'
  ]
  const handleExportAuditPDF = () => {
    exportToPDF({
      data: audit,
      columns: auditColumns,
      fileName: 'audit-log.pdf',
      header: 'Izvještaj - Audit Trail',
    })
  }
  const handleExportAuditExcel = () => {
    exportToExcel({
      data: audit,
      columns: auditColumns,
      fileName: 'audit-log.xlsx',
    })
  }
  const handlePrintAudit = () => {
    printTable({
      data: audit,
      columns: auditColumns,
      columnLabels: auditColumnLabels,
      title: 'Audit Trail'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Dobrodošli u centralni panel za upravljanje sistemom</p>
        </div>

        {/* Statistike */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <Tabs value={selectedModule} onValueChange={setSelectedModule} className="space-y-6">
          <TabsList className="grid w-full grid-cols-13">
            <TabsTrigger value="overview">Pregled</TabsTrigger>
            <TabsTrigger value="users">Korisnici</TabsTrigger>
            <TabsTrigger value="production">Proizvodnja</TabsTrigger>
            <TabsTrigger value="treasury">Blagajna</TabsTrigger>
            <TabsTrigger value="reports">Izvještaji</TabsTrigger>
            <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            <TabsTrigger value="print-settings">Postavke Printa</TabsTrigger>
            <TabsTrigger value="advanced-reports">Napredni Izvještaji</TabsTrigger>
            <TabsTrigger value="analytics">Analitika</TabsTrigger>
            <TabsTrigger value="system-config">Konfiguracija</TabsTrigger>
            <TabsTrigger value="ai-integration">AI Integracija</TabsTrigger>
            <TabsTrigger value="automation">Automatizacija</TabsTrigger>
            <TabsTrigger value="data-migration">Migracija</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Moduli */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <module.icon className="h-4 w-4" />
                      {module.name}
                    </CardTitle>
                    {module.count && <Badge>{module.count}</Badge>}
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{module.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Brze akcije */}
            <QuickActions />

            {/* Nedavne aktivnosti */}
            <Card>
              <CardHeader>
                <CardTitle>Nedavne Aktivnosti</CardTitle>
                <CardDescription>Pregled najnovijih aktivnosti u sistemu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Nova ponuda kreirana",
                      user: "Marko Petrović",
                      time: "prije 5 minuta",
                      status: "success",
                    },
                    {
                      action: "Radni nalog završen",
                      user: "Ana Jovanović",
                      time: "prije 15 minuta",
                      status: "success",
                    },
                    {
                      action: "Upozorenje - nisko stanje",
                      user: "Sistem",
                      time: "prije 30 minuta",
                      status: "warning",
                    },
                    {
                      action: "Novi korisnik registrovan",
                      user: "Admin",
                      time: "prije 1 sat",
                      status: "info",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {activity.status === "info" && <QrCode className="h-4 w-4 text-blue-500" />}
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Korisnici</CardTitle>
                  <CardDescription>Upravljanje korisnicima, ulogama i dozvolama</CardDescription>
                </div>
                <Button onClick={openAdd}>Dodaj korisnika</Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-4">
                  <Input
                    placeholder="Pretraži po imenu ili emailu..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="w-64"
                  />
                  <select className="input" value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
                    <option value="">Sve uloge</option>
                    <option value="user">Korisnik</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <select className="input" value={userStatusFilter} onChange={e => setUserStatusFilter(e.target.value)}>
                    <option value="">Svi statusi</option>
                    <option value="active">Aktivni</option>
                    <option value="inactive">Neaktivni</option>
                  </select>
                </div>
                {/* Dugmad za export i print */}
                <div className="flex gap-2 mb-4">
                  <button onClick={handleExportUsersPDF} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export u PDF</button>
                  <button onClick={handleExportUsersExcel} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Export u Excel</button>
                  <button onClick={handlePrintUsers} className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Printaj</button>
                </div>
                {usersLoading ? (
                  <div>Učitavanje...</div>
                ) : usersError ? (
                  <div className="text-red-500">{usersError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left p-2">Korisničko ime</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Uloga</th>
                          <th className="text-left p-2">Dozvole</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Akcije</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u: any) => (
                          <tr key={u.id} className="border-b last:border-b-0">
                            <td className="p-2 whitespace-nowrap">{u.username}</td>
                            <td className="p-2 whitespace-nowrap">{u.email}</td>
                            <td className="p-2 whitespace-nowrap capitalize">{u.role}</td>
                            <td className="p-2 whitespace-nowrap">{Array.isArray(u.permissions) ? u.permissions.join(", ") : u.permissions}</td>
                            <td className="p-2 whitespace-nowrap">
                              {u.active ? <span className="text-green-600">Aktivan</span> : <span className="text-red-600">Neaktivan</span>}
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <button className="text-blue-600 hover:underline mr-2" onClick={() => openEdit(u)}>Uredi</button>
                              <button className={u.active ? "text-red-600 hover:underline" : "text-green-600 hover:underline"} onClick={() => handleToggleActive(u)}>
                                {u.active ? "Deaktiviraj" : "Aktiviraj"}
                              </button>
                              <button className="text-orange-600 hover:underline ml-2" onClick={() => handleResetPassword(u)}>Resetuj lozinku</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <Dialog open={addOpen} onOpenChange={v => !v && setAddOpen(false)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dodaj korisnika</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input value={addEmail} onChange={e => setAddEmail(e.target.value)} type="email" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Korisničko ime</label>
                        <Input value={addUsername} onChange={e => setAddUsername(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Lozinka</label>
                        <Input value={addPassword} onChange={e => setAddPassword(e.target.value)} type="password" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Uloga</label>
                        <select className="input" value={addRole} onChange={e => setAddRole(e.target.value)}>
                          <option value="user">Korisnik</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Dozvole</label>
                        <div className="flex flex-wrap gap-2">
                          {allPermissions.map((perm) => (
                            <label key={perm} className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={addPermissions.includes(perm)}
                                onChange={e => {
                                  if (e.target.checked) setAddPermissions([...addPermissions, perm])
                                  else setAddPermissions(addPermissions.filter(p => p !== perm))
                                }}
                              />
                              {perm}
                            </label>
                          ))}
                        </div>
                      </div>
                      {addError && <div className="text-red-500 text-sm">{addError}</div>}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAddOpen(false)} disabled={addLoading}>Otkaži</Button>
                      <Button onClick={handleAddSave} disabled={addLoading}>
                        {addLoading && <span className="animate-spin mr-2">⏳</span>}
                        Dodaj korisnika
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={!!editUser} onOpenChange={v => !v && setEditUser(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Uredi korisnika: {editUser?.username}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Uloga</label>
                        <select className="input" value={editRole} onChange={e => setEditRole(e.target.value)}>
                          <option value="user">Korisnik</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Dozvole</label>
                        <div className="flex flex-wrap gap-2">
                          {allPermissions.map((perm) => (
                            <label key={perm} className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={editPermissions.includes(perm)}
                                onChange={e => {
                                  if (e.target.checked) setEditPermissions([...editPermissions, perm])
                                  else setEditPermissions(editPermissions.filter(p => p !== perm))
                                }}
                              />
                              {perm}
                            </label>
                          ))}
                        </div>
                      </div>
                      {editError && <div className="text-red-500 text-sm">{editError}</div>}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditUser(null)} disabled={editLoading}>Otkaži</Button>
                      <Button onClick={handleEditSave} disabled={editLoading}>
                        {editLoading && <span className="animate-spin mr-2">⏳</span>}
                        Spremi izmjene
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="production">
            <Card>
              <CardHeader>
                <CardTitle>Proizvodnja</CardTitle>
                <CardDescription>Upravljanje ponudama, radnim nalozima i proizvodnim procesima</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Proizvodni moduli će biti implementirani ovdje...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treasury">
            <Card>
              <CardHeader>
                <CardTitle>Blagajna</CardTitle>
                <CardDescription>Finansijsko upravljanje i praćenje transakcija</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Blagajnički modul će biti implementiran ovdje...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Izvještaji</CardTitle>
                <CardDescription>Agregirani podaci o sistemu</CardDescription>
                {/* Dugmad za export i print */}
                <div className="flex gap-2 mt-4">
                  <button onClick={handleExportReportsPDF} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export u PDF</button>
                  <button onClick={handleExportReportsExcel} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Export u Excel</button>
                  <button onClick={handlePrintReports} className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Printaj</button>
                </div>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div>Učitavanje...</div>
                ) : reportsError ? (
                  <div className="text-red-500">{reportsError}</div>
                ) : reports ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Korisnika</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{reports.users}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Ponuda</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{reports.ponude}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Otpremnica</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{reports.otpremnice}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Ukupni promet (€)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{reports.promet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Radnih naloga</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{reports.nalozi}</div>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Pregled svih aktivnosti korisnika u sistemu</CardDescription>
                <div className="flex gap-4 mt-4">
                  <input
                    className="input"
                    placeholder="Filter po korisniku"
                    value={auditUser}
                    onChange={e => setAuditUser(e.target.value)}
                  />
                  <input
                    className="input"
                    placeholder="Filter po akciji"
                    value={auditAction}
                    onChange={e => setAuditAction(e.target.value)}
                  />
                </div>
                {/* Dugmad za export i print */}
                <div className="flex gap-2 mt-4">
                  <button onClick={handleExportAuditPDF} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Export u PDF</button>
                  <button onClick={handleExportAuditExcel} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Export u Excel</button>
                  <button onClick={handlePrintAudit} className="px-3 py-1 bg-gray-600 text-white rounded text-sm">Printaj</button>
                </div>
              </CardHeader>
              <CardContent>
                {auditLoading ? (
                  <div>Učitavanje...</div>
                ) : auditError ? (
                  <div className="text-red-500">{auditError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left p-2">Vrijeme</th>
                          <th className="text-left p-2">Korisnik</th>
                          <th className="text-left p-2">Akcija</th>
                          <th className="text-left p-2">Detalji</th>
                          <th className="text-left p-2">IP</th>
                          <th className="text-left p-2">Lokacija</th>
                        </tr>
                      </thead>
                      <tbody>
                        {audit.map((a) => (
                          <tr key={a.id} className="border-b last:border-b-0">
                            <td className="p-2 whitespace-nowrap">{a.timestamp?.slice(0, 19).replace("T", " ")}</td>
                            <td className="p-2 whitespace-nowrap">{a.username || a.user_id}</td>
                            <td className="p-2 whitespace-nowrap">{a.action}</td>
                            <td className="p-2 whitespace-nowrap">
                              <pre className="max-w-xs overflow-x-auto bg-muted rounded p-1 text-xs">{a.details ? JSON.stringify(a.details, null, 2) : "-"}</pre>
                            </td>
                            <td className="p-2 whitespace-nowrap">{a.ip || "-"}</td>
                            <td className="p-2 whitespace-nowrap">{a.location || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="print-settings">
            <PrintSettings />
          </TabsContent>

          <TabsContent value="advanced-reports">
            <AdvancedReports />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="system-config">
            <SystemConfig />
          </TabsContent>

          <TabsContent value="ai-integration">
            <AIIntegration />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationWorkflows />
          </TabsContent>

          <TabsContent value="data-migration">
            <DataMigration />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
