"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Globe, 
  Save, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface SystemConfig {
  database: {
    backupEnabled: boolean;
    backupFrequency: "daily" | "weekly" | "monthly";
    retentionDays: number;
    autoOptimize: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    requireMFA: boolean;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    criticalAlerts: boolean;
    dailyReports: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheSize: number;
    autoCleanup: boolean;
    compressionEnabled: boolean;
  };
  integrations: {
    emailService: "smtp" | "sendgrid" | "mailgun";
    smsService: "twilio" | "nexmo" | "custom";
    backupService: "local" | "aws" | "google";
  };
}

export default function SystemConfig() {
  const [config, setConfig] = useState<SystemConfig>({
    database: {
      backupEnabled: true,
      backupFrequency: "daily",
      retentionDays: 30,
      autoOptimize: true
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      requireMFA: false,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      }
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      criticalAlerts: true,
      dailyReports: false
    },
    performance: {
      cacheEnabled: true,
      cacheSize: 100,
      autoCleanup: true,
      compressionEnabled: true
    },
    integrations: {
      emailService: "smtp",
      smsService: "twilio",
      backupService: "local"
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Simulacija čuvanja konfiguracije
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Konfiguracija sistema je uspješno sačuvana");
    } catch (error) {
      toast.error("Greška pri čuvanju konfiguracije");
    } finally {
      setIsSaving(false);
    }
  };

  const testConnection = async (service: string) => {
    try {
      setIsTesting(true);
      // Simulacija testiranja konekcije
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success(`${service} konekcija je uspješna`);
    } catch (error) {
      toast.error(`Greška pri testiranju ${service} konekcije`);
    } finally {
      setIsTesting(false);
    }
  };

  const backupDatabase = async () => {
    try {
      setIsTesting(true);
      // Simulacija backup-a
      await new Promise(resolve => setTimeout(resolve, 5000));
      toast.success("Backup baze podataka je uspješno kreiran");
    } catch (error) {
      toast.error("Greška pri kreiranju backup-a");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Konfiguracija Sistema</h2>
          <p className="text-muted-foreground">
            Napredne postavke sistema i konfiguracija servisa
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Čuvanje..." : "Sačuvaj Konfiguraciju"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Baza Podataka */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Baza Podataka
            </CardTitle>
            <CardDescription>
              Konfiguracija backup-a i optimizacije baze podataka
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="backup-enabled"
                checked={config.database.backupEnabled}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    database: { ...prev.database, backupEnabled: checked }
                  }))
                }
              />
              <Label htmlFor="backup-enabled">Omogući automatski backup</Label>
            </div>

            {config.database.backupEnabled && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="backup-frequency">Frekvencija backup-a</Label>
                  <Select
                    value={config.database.backupFrequency}
                    onValueChange={(value: "daily" | "weekly" | "monthly") =>
                      setConfig(prev => ({
                        ...prev,
                        database: { ...prev.database, backupFrequency: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Dnevno</SelectItem>
                      <SelectItem value="weekly">Sedmično</SelectItem>
                      <SelectItem value="monthly">Mjesečno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="retention-days">Retencija (dana)</Label>
                  <Input
                    id="retention-days"
                    type="number"
                    min="1"
                    max="365"
                    value={config.database.retentionDays}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        database: { ...prev.database, retentionDays: parseInt(e.target.value) }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-optimize"
                    checked={config.database.autoOptimize}
                    onCheckedChange={(checked) =>
                      setConfig(prev => ({
                        ...prev,
                        database: { ...prev.database, autoOptimize: checked }
                      }))
                    }
                  />
                  <Label htmlFor="auto-optimize">Automatska optimizacija</Label>
                </div>

                <Button
                  onClick={backupDatabase}
                  disabled={isTesting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {isTesting ? "Kreiranje backup-a..." : "Kreiraj Backup"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sigurnost */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sigurnost
            </CardTitle>
            <CardDescription>
              Postavke sigurnosti i autentikacije
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="session-timeout">Timeout sesije (minuta)</Label>
              <Input
                id="session-timeout"
                type="number"
                min="5"
                max="480"
                value={config.security.sessionTimeout}
                onChange={(e) =>
                  setConfig(prev => ({
                    ...prev,
                    security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="max-login-attempts">Maksimalno pokušaja prijave</Label>
              <Input
                id="max-login-attempts"
                type="number"
                min="3"
                max="10"
                value={config.security.maxLoginAttempts}
                onChange={(e) =>
                  setConfig(prev => ({
                    ...prev,
                    security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) }
                  }))
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="require-mfa"
                checked={config.security.requireMFA}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    security: { ...prev.security, requireMFA: checked }
                  }))
                }
              />
              <Label htmlFor="require-mfa">Zahtijevaj MFA</Label>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium">Politika lozinki</Label>
              <div className="space-y-2 mt-2">
                <div>
                  <Label htmlFor="min-length">Minimalna dužina</Label>
                  <Input
                    id="min-length"
                    type="number"
                    min="6"
                    max="20"
                    value={config.security.passwordPolicy.minLength}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          passwordPolicy: {
                            ...prev.security.passwordPolicy,
                            minLength: parseInt(e.target.value)
                          }
                        }
                      }))
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="require-uppercase"
                    checked={config.security.passwordPolicy.requireUppercase}
                    onCheckedChange={(checked) =>
                      setConfig(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          passwordPolicy: {
                            ...prev.security.passwordPolicy,
                            requireUppercase: checked
                          }
                        }
                      }))
                    }
                  />
                  <Label htmlFor="require-uppercase">Zahtijevaj velika slova</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="require-numbers"
                    checked={config.security.passwordPolicy.requireNumbers}
                    onCheckedChange={(checked) =>
                      setConfig(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          passwordPolicy: {
                            ...prev.security.passwordPolicy,
                            requireNumbers: checked
                          }
                        }
                      }))
                    }
                  />
                  <Label htmlFor="require-numbers">Zahtijevaj brojeve</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Obaveštenja */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Obaveštenja
            </CardTitle>
            <CardDescription>
              Konfiguracija sistema obaveštenja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="email-enabled"
                checked={config.notifications.emailEnabled}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, emailEnabled: checked }
                  }))
                }
              />
              <Label htmlFor="email-enabled">Email obaveštenja</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="sms-enabled"
                checked={config.notifications.smsEnabled}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, smsEnabled: checked }
                  }))
                }
              />
              <Label htmlFor="sms-enabled">SMS obaveštenja</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="push-enabled"
                checked={config.notifications.pushEnabled}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, pushEnabled: checked }
                  }))
                }
              />
              <Label htmlFor="push-enabled">Push obaveštenja</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="critical-alerts"
                checked={config.notifications.criticalAlerts}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, criticalAlerts: checked }
                  }))
                }
              />
              <Label htmlFor="critical-alerts">Kritična upozorenja</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="daily-reports"
                checked={config.notifications.dailyReports}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, dailyReports: checked }
                  }))
                }
              />
              <Label htmlFor="daily-reports">Dnevni izvještaji</Label>
            </div>
          </CardContent>
        </Card>

        {/* Performanse */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Performanse
            </CardTitle>
            <CardDescription>
              Optimizacija performansi sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="cache-enabled"
                checked={config.performance.cacheEnabled}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    performance: { ...prev.performance, cacheEnabled: checked }
                  }))
                }
              />
              <Label htmlFor="cache-enabled">Omogući keš</Label>
            </div>

            {config.performance.cacheEnabled && (
              <div>
                <Label htmlFor="cache-size">Veličina keša (MB)</Label>
                <Input
                  id="cache-size"
                  type="number"
                  min="10"
                  max="1000"
                  value={config.performance.cacheSize}
                  onChange={(e) =>
                    setConfig(prev => ({
                      ...prev,
                      performance: { ...prev.performance, cacheSize: parseInt(e.target.value) }
                    }))
                  }
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-cleanup"
                checked={config.performance.autoCleanup}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    performance: { ...prev.performance, autoCleanup: checked }
                  }))
                }
              />
              <Label htmlFor="auto-cleanup">Automatsko čišćenje</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="compression-enabled"
                checked={config.performance.compressionEnabled}
                onCheckedChange={(checked) =>
                  setConfig(prev => ({
                    ...prev,
                    performance: { ...prev.performance, compressionEnabled: checked }
                  }))
                }
              />
              <Label htmlFor="compression-enabled">Kompresija podataka</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integracije */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Integracije
          </CardTitle>
          <CardDescription>
            Konfiguracija vanjskih servisa i integracija
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-service">Email servis</Label>
                <Select
                  value={config.integrations.emailService}
                  onValueChange={(value: "smtp" | "sendgrid" | "mailgun") =>
                    setConfig(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, emailService: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => testConnection("Email")}
                disabled={isTesting}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Testiraj
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="sms-service">SMS servis</Label>
                <Select
                  value={config.integrations.smsService}
                  onValueChange={(value: "twilio" | "nexmo" | "custom") =>
                    setConfig(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, smsService: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="nexmo">Nexmo</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => testConnection("SMS")}
                disabled={isTesting}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Testiraj
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="backup-service">Backup servis</Label>
                <Select
                  value={config.integrations.backupService}
                  onValueChange={(value: "local" | "aws" | "google") =>
                    setConfig(prev => ({
                      ...prev,
                      integrations: { ...prev.integrations, backupService: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Lokalni</SelectItem>
                    <SelectItem value="aws">AWS S3</SelectItem>
                    <SelectItem value="google">Google Cloud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => testConnection("Backup")}
                disabled={isTesting}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Testiraj
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Status Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Baza Podataka</p>
                <p className="text-sm text-muted-foreground">Supabase</p>
              </div>
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Email Servis</p>
                <p className="text-sm text-muted-foreground">SMTP</p>
              </div>
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Aktivan
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Backup</p>
                <p className="text-sm text-muted-foreground">Lokalni</p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Zadnji: 2h
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Keš</p>
                <p className="text-sm text-muted-foreground">100MB</p>
              </div>
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Aktivan
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 