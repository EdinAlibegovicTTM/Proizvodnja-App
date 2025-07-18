"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Upload, 
  Download, 
  RefreshCw, 
  Settings, 
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Save,
  Play,
  Pause
} from "lucide-react";
import { toast } from "sonner";

interface MigrationJob {
  id: string;
  name: string;
  type: "backup" | "restore" | "migrate" | "sync";
  status: "pending" | "running" | "completed" | "failed" | "paused";
  progress: number;
  startTime?: Date;
  endTime?: Date;
  size: number;
  records: number;
  source: string;
  destination: string;
  error?: string;
}

interface BackupConfig {
  autoBackup: boolean;
  frequency: "daily" | "weekly" | "monthly";
  retention: number;
  compression: boolean;
  encryption: boolean;
  includeFiles: boolean;
  backupLocation: "local" | "cloud" | "both";
}

export default function DataMigration() {
  const [migrationJobs, setMigrationJobs] = useState<MigrationJob[]>([
    {
      id: "1",
      name: "Dnevni Backup Baze Podataka",
      type: "backup",
      status: "completed",
      progress: 100,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
      size: 256,
      records: 15420,
      source: "production_db",
      destination: "backup_storage"
    },
    {
      id: "2",
      name: "Migracija Korisnika",
      type: "migrate",
      status: "running",
      progress: 65,
      startTime: new Date(Date.now() - 30 * 60 * 1000),
      size: 128,
      records: 8500,
      source: "old_system",
      destination: "new_system"
    },
    {
      id: "3",
      name: "Sinkronizacija Skladišta",
      type: "sync",
      status: "pending",
      progress: 0,
      size: 512,
      records: 25000,
      source: "warehouse_db",
      destination: "erp_system"
    }
  ]);

  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    autoBackup: true,
    frequency: "daily",
    retention: 30,
    compression: true,
    encryption: true,
    includeFiles: true,
    backupLocation: "both"
  });

  const [selectedJob, setSelectedJob] = useState<MigrationJob | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const createBackup = async () => {
    try {
      setIsRunning(true);
      const newJob: MigrationJob = {
        id: Date.now().toString(),
        name: `Backup ${new Date().toLocaleDateString()}`,
        type: "backup",
        status: "running",
        progress: 0,
        startTime: new Date(),
        size: 0,
        records: 0,
        source: "production_db",
        destination: "backup_storage"
      };

      setMigrationJobs(prev => [newJob, ...prev]);

      // Simulacija backup procesa
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setMigrationJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, progress: i, size: Math.floor(i * 2.5), records: Math.floor(i * 150) }
            : job
        ));
      }

      setMigrationJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: "completed", endTime: new Date() }
          : job
      ));

      toast.success("Backup je uspješno kreiran");
    } catch (error) {
      toast.error("Greška pri kreiranju backup-a");
    } finally {
      setIsRunning(false);
    }
  };

  const restoreBackup = async (jobId: string) => {
    try {
      setIsRunning(true);
      setMigrationJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: "running", progress: 0 }
          : job
      ));

      // Simulacija restore procesa
      for (let i = 0; i <= 100; i += 15) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setMigrationJobs(prev => prev.map(job => 
          job.id === jobId 
            ? { ...job, progress: i }
            : job
        ));
      }

      setMigrationJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: "completed", endTime: new Date() }
          : job
      ));

      toast.success("Restore je uspješno završen");
    } catch (error) {
      toast.error("Greška pri restore-u");
    } finally {
      setIsRunning(false);
    }
  };

  const pauseJob = (jobId: string) => {
    setMigrationJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: "paused" }
        : job
    ));
    toast.success("Job je pauziran");
  };

  const resumeJob = (jobId: string) => {
    setMigrationJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: "running" }
        : job
    ));
    toast.success("Job je nastavljen");
  };

  const deleteJob = (jobId: string) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati ovaj job?")) return;
    
    setMigrationJobs(prev => prev.filter(job => job.id !== jobId));
    toast.success("Job je obrisan");
  };

  const saveBackupConfig = async () => {
    try {
      // Simulacija čuvanja konfiguracije
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Konfiguracija backup-a je sačuvana");
    } catch (error) {
      toast.error("Greška pri čuvanju konfiguracije");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "running": return "default";
      case "pending": return "secondary";
      case "failed": return "destructive";
      case "paused": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "running": return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "paused": return <Pause className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "backup": return <Download className="h-4 w-4" />;
      case "restore": return <Upload className="h-4 w-4" />;
      case "migrate": return <ArrowRight className="h-4 w-4" />;
      case "sync": return <RefreshCw className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Migracija i Backup Podataka</h2>
          <p className="text-muted-foreground">
            Upravljanje backup-om, restore-om i migracijom podataka
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={createBackup}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isRunning ? "Kreiranje..." : "Kreiraj Backup"}
          </Button>
          <Button 
            variant="outline"
            onClick={saveBackupConfig}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Sačuvaj Konfiguraciju
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lista Job-ova */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Migracija Job-ovi</CardTitle>
              <CardDescription>
                Pregled svih backup, restore i migracija job-ova
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {migrationJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedJob?.id === job.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(job.type)}
                        <div>
                          <h4 className="font-medium">{job.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {job.source} → {job.destination}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <Badge variant={getStatusColor(job.status)}>
                          {job.status === "completed" ? "Završen" :
                           job.status === "running" ? "U toku" :
                           job.status === "pending" ? "Na čekanju" :
                           job.status === "failed" ? "Greška" :
                           job.status === "paused" ? "Pauziran" : job.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Napredak</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Veličina:</span>
                          <span className="ml-1">{job.size} MB</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Zapisi:</span>
                          <span className="ml-1">{job.records.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tip:</span>
                          <span className="ml-1 capitalize">{job.type}</span>
                        </div>
                      </div>

                      {job.startTime && (
                        <div className="text-xs text-muted-foreground">
                          Početak: {job.startTime.toLocaleString()}
                          {job.endTime && ` • Kraj: ${job.endTime.toLocaleString()}`}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        {job.status === "running" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              pauseJob(job.id);
                            }}
                          >
                            <Pause className="h-3 w-3 mr-1" />
                            Pauziraj
                          </Button>
                        )}
                        {job.status === "paused" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              resumeJob(job.id);
                            }}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Nastavi
                          </Button>
                        )}
                        {job.type === "backup" && job.status === "completed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreBackup(job.id);
                            }}
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Restore
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteJob(job.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Konfiguracija */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Backup Konfiguracija
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-backup"
                  checked={backupConfig.autoBackup}
                  onCheckedChange={(checked) =>
                    setBackupConfig(prev => ({ ...prev, autoBackup: checked }))
                  }
                />
                <Label htmlFor="auto-backup">Automatski backup</Label>
              </div>

              {backupConfig.autoBackup && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frequency">Frekvencija</Label>
                    <Select
                      value={backupConfig.frequency}
                      onValueChange={(value: "daily" | "weekly" | "monthly") =>
                        setBackupConfig(prev => ({ ...prev, frequency: value }))
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
                    <Label htmlFor="retention">Retencija (dana)</Label>
                    <Input
                      id="retention"
                      type="number"
                      min="1"
                      max="365"
                      value={backupConfig.retention}
                      onChange={(e) =>
                        setBackupConfig(prev => ({ ...prev, retention: parseInt(e.target.value) }))
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="compression"
                      checked={backupConfig.compression}
                      onCheckedChange={(checked) =>
                        setBackupConfig(prev => ({ ...prev, compression: checked }))
                      }
                    />
                    <Label htmlFor="compression">Kompresija</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="encryption"
                      checked={backupConfig.encryption}
                      onCheckedChange={(checked) =>
                        setBackupConfig(prev => ({ ...prev, encryption: checked }))
                      }
                    />
                    <Label htmlFor="encryption">Enkripcija</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-files"
                      checked={backupConfig.includeFiles}
                      onCheckedChange={(checked) =>
                        setBackupConfig(prev => ({ ...prev, includeFiles: checked }))
                      }
                    />
                    <Label htmlFor="include-files">Uključi fajlove</Label>
                  </div>

                  <div>
                    <Label htmlFor="backup-location">Lokacija backup-a</Label>
                    <Select
                      value={backupConfig.backupLocation}
                      onValueChange={(value: "local" | "cloud" | "both") =>
                        setBackupConfig(prev => ({ ...prev, backupLocation: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Lokalno</SelectItem>
                        <SelectItem value="cloud">Cloud</SelectItem>
                        <SelectItem value="both">Lokalno + Cloud</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistike */}
          <Card>
            <CardHeader>
              <CardTitle>Statistike</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ukupno backup-ova</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ukupna veličina</span>
                  <span className="font-semibold">45.2 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uspješnost</span>
                  <span className="font-semibold text-green-600">99.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Zadnji backup</span>
                  <span className="text-sm text-muted-foreground">prije 2 sata</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 