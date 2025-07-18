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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Workflow, 
  Clock, 
  Calendar, 
  Zap, 
  Settings, 
  Play,
  Pause,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  Timer
} from "lucide-react";
import { toast } from "sonner";

interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: "schedule" | "event" | "manual" | "webhook";
  status: "active" | "inactive" | "error";
  schedule?: {
    frequency: "daily" | "weekly" | "monthly" | "custom";
    time: string;
    days?: string[];
    interval?: number;
  };
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  lastRun?: Date;
  nextRun?: Date;
  executionCount: number;
  successRate: number;
}

interface AutomationCondition {
  id: string;
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "not_contains";
  value: string | number;
  enabled: boolean;
}

interface AutomationAction {
  id: string;
  type: "create_record" | "update_record" | "delete_record" | "send_email" | "send_notification" | "generate_report" | "webhook_call";
  config: any;
  enabled: boolean;
  order: number;
}

export default function AutomationWorkflows() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([
    {
      id: "1",
      name: "Automatsko Kreiranje Radnih Naloga",
      description: "Kreira radne naloge na osnovu novih ponuda",
      trigger: "event",
      status: "active",
      conditions: [
        {
          id: "1",
          field: "status",
          operator: "equals",
          value: "approved",
          enabled: true
        }
      ],
      actions: [
        {
          id: "1",
          type: "create_record",
          config: { table: "radni_nalozi", template: "default" },
          enabled: true,
          order: 1
        },
        {
          id: "2",
          type: "send_notification",
          config: { recipients: ["production_team"], message: "Novi radni nalog kreiran" },
          enabled: true,
          order: 2
        }
      ],
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000),
      executionCount: 45,
      successRate: 98.5
    },
    {
      id: "2",
      name: "Dnevni Izvještaj Proizvodnje",
      description: "Generiše dnevni izvještaj proizvodnje",
      trigger: "schedule",
      status: "active",
      schedule: {
        frequency: "daily",
        time: "18:00"
      },
      conditions: [],
      actions: [
        {
          id: "1",
          type: "generate_report",
          config: { type: "production_daily", format: "pdf" },
          enabled: true,
          order: 1
        },
        {
          id: "2",
          type: "send_email",
          config: { recipients: ["management"], subject: "Dnevni izvještaj proizvodnje" },
          enabled: true,
          order: 2
        }
      ],
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000),
      executionCount: 156,
      successRate: 99.2
    }
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const createWorkflow = () => {
    const newWorkflow: AutomationWorkflow = {
      id: Date.now().toString(),
      name: "Novi Workflow",
      description: "Opis novog workflow-a",
      trigger: "manual",
      status: "inactive",
      conditions: [],
      actions: [],
      executionCount: 0,
      successRate: 0
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setIsEditing(true);
  };

  const saveWorkflow = async (workflow: AutomationWorkflow) => {
    try {
      // Simulacija čuvanja
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWorkflows(prev => prev.map(w => w.id === workflow.id ? workflow : w));
      setIsEditing(false);
      toast.success("Workflow je uspješno sačuvan");
    } catch (error) {
      toast.error("Greška pri čuvanju workflow-a");
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    if (!window.confirm("Da li ste sigurni da želite obrisati ovaj workflow?")) return;
    
    try {
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(null);
        setIsEditing(false);
      }
      toast.success("Workflow je uspješno obrisan");
    } catch (error) {
      toast.error("Greška pri brisanju workflow-a");
    }
  };

  const runWorkflow = async (workflowId: string) => {
    try {
      setIsRunning(true);
      // Simulacija izvršavanja
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { 
              ...w, 
              lastRun: new Date(),
              executionCount: w.executionCount + 1,
              successRate: Math.min(100, w.successRate + 0.5)
            }
          : w
      ));
      
      toast.success("Workflow je uspješno izvršen");
    } catch (error) {
      toast.error("Greška pri izvršavanju workflow-a");
    } finally {
      setIsRunning(false);
    }
  };

  const toggleWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: w.status === "active" ? "inactive" : "active" }
        : w
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "error": return "destructive";
      default: return "outline";
    }
  };

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "schedule": return <Clock className="h-4 w-4" />;
      case "event": return <Zap className="h-4 w-4" />;
      case "manual": return <Play className="h-4 w-4" />;
      case "webhook": return <Settings className="h-4 w-4" />;
      default: return <Workflow className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automatizacija Workflow-ova</h2>
          <p className="text-muted-foreground">
            Upravljanje automatiziranim procesima i workflow-ovima
          </p>
        </div>
        <Button onClick={createWorkflow} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novi Workflow
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lista Workflow-ova */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow-ovi</CardTitle>
              <CardDescription>
                {workflows.length} aktivnih workflow-ova
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedWorkflow?.id === workflow.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{workflow.name}</h4>
                      <Badge variant={getStatusColor(workflow.status)}>
                        {workflow.status === "active" ? "Aktivan" : 
                         workflow.status === "inactive" ? "Neaktivan" : "Greška"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{workflow.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getTriggerIcon(workflow.trigger)}
                      <span className="capitalize">{workflow.trigger}</span>
                      <span>•</span>
                      <span>{workflow.executionCount} izvršavanja</span>
                      <span>•</span>
                      <span>{workflow.successRate.toFixed(1)}% uspješnost</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalji Workflow-a */}
        <div className="lg:col-span-2">
          {selectedWorkflow ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5" />
                      {selectedWorkflow.name}
                    </CardTitle>
                    <CardDescription>{selectedWorkflow.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleWorkflow(selectedWorkflow.id)}
                    >
                      {selectedWorkflow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runWorkflow(selectedWorkflow.id)}
                      disabled={isRunning}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteWorkflow(selectedWorkflow.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Pregled</TabsTrigger>
                    <TabsTrigger value="conditions">Uslovi</TabsTrigger>
                    <TabsTrigger value="actions">Akcije</TabsTrigger>
                    <TabsTrigger value="history">Istorija</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm font-medium">Trigger</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {getTriggerIcon(selectedWorkflow.trigger)}
                          <span className="capitalize">{selectedWorkflow.trigger}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Badge variant={getStatusColor(selectedWorkflow.status)} className="mt-1">
                          {selectedWorkflow.status === "active" ? "Aktivan" : 
                           selectedWorkflow.status === "inactive" ? "Neaktivan" : "Greška"}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Zadnje izvršavanje</Label>
                        <div className="text-sm text-muted-foreground mt-1">
                          {selectedWorkflow.lastRun ? selectedWorkflow.lastRun.toLocaleString() : "Nikad"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Sljedeće izvršavanje</Label>
                        <div className="text-sm text-muted-foreground mt-1">
                          {selectedWorkflow.nextRun ? selectedWorkflow.nextRun.toLocaleString() : "Nije planirano"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Broj izvršavanja</Label>
                        <div className="text-2xl font-bold">{selectedWorkflow.executionCount}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Uspješnost</Label>
                        <div className="text-2xl font-bold text-green-600">{selectedWorkflow.successRate.toFixed(1)}%</div>
                      </div>
                    </div>

                    {selectedWorkflow.schedule && (
                      <div>
                        <Label className="text-sm font-medium">Raspored</Label>
                        <div className="mt-1 p-3 bg-muted rounded-lg">
                          <div className="grid gap-2 md:grid-cols-2">
                            <div>
                              <span className="text-sm text-muted-foreground">Frekvencija:</span>
                              <span className="ml-2 capitalize">{selectedWorkflow.schedule.frequency}</span>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Vrijeme:</span>
                              <span className="ml-2">{selectedWorkflow.schedule.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="conditions" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Uslovi izvršavanja</h4>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Dodaj uslov
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {selectedWorkflow.conditions.map((condition) => (
                        <div key={condition.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={condition.enabled}
                              onCheckedChange={(checked) => {
                                // Update condition logic here
                              }}
                            />
                            <span className="text-sm">
                              {condition.field} {condition.operator} {condition.value}
                            </span>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {selectedWorkflow.conditions.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                          <p>Nema definisanih uslova</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Akcije</h4>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Dodaj akciju
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {selectedWorkflow.actions
                        .sort((a, b) => a.order - b.order)
                        .map((action) => (
                        <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                              {action.order}
                            </div>
                            <div>
                              <div className="font-medium capitalize">
                                {action.type.replace("_", " ")}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {JSON.stringify(action.config)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={action.enabled}
                              onCheckedChange={(checked) => {
                                // Update action logic here
                              }}
                            />
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="space-y-4">
                    <h4 className="font-medium">Istorija izvršavanja</h4>
                    <div className="space-y-2">
                      {[
                        { date: new Date(), status: "success", duration: "2.3s" },
                        { date: new Date(Date.now() - 24 * 60 * 60 * 1000), status: "success", duration: "1.8s" },
                        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: "error", duration: "0.5s" }
                      ].map((execution, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {execution.status === "success" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <div>
                              <div className="font-medium">
                                {execution.date.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Trajanje: {execution.duration}
                              </div>
                            </div>
                          </div>
                          <Badge variant={execution.status === "success" ? "default" : "destructive"}>
                            {execution.status === "success" ? "Uspješno" : "Greška"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Workflow className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Odaberite Workflow</h3>
                <p className="text-muted-foreground">
                  Odaberite workflow iz liste da vidite detalje i upravljajte njime.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 