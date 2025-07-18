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
  Brain, 
  Zap, 
  Bot, 
  MessageSquare, 
  FileText, 
  BarChart3,
  Settings,
  Play,
  Pause,
  Save,
  TestTube,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: "manual" | "scheduled" | "event";
  status: "active" | "inactive" | "error";
  lastRun: Date;
  nextRun?: Date;
  actions: AIAction[];
}

interface AIAction {
  type: "data_analysis" | "report_generation" | "prediction" | "optimization" | "notification";
  config: any;
  enabled: boolean;
}

interface AIPrediction {
  module: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: "up" | "down" | "stable";
}

export default function AIIntegration() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [apiKey, setApiKey] = useState("");
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([
    {
      id: "1",
      name: "Dnevna Analiza Proizvodnje",
      description: "Analizira dnevne podatke proizvodnje i generiše izvještaje",
      trigger: "scheduled",
      status: "active",
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000),
      actions: [
        { type: "data_analysis", config: { module: "production" }, enabled: true },
        { type: "report_generation", config: { format: "pdf" }, enabled: true },
        { type: "notification", config: { email: true }, enabled: true }
      ]
    },
    {
      id: "2",
      name: "Predviđanje Potražnje",
      description: "Analizira trendove i predviđa potražnju za proizvode",
      trigger: "scheduled",
      status: "active",
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      actions: [
        { type: "prediction", config: { horizon: 30 }, enabled: true },
        { type: "optimization", config: { inventory: true }, enabled: true }
      ]
    }
  ]);

  const [predictions, setPredictions] = useState<AIPrediction[]>([
    {
      module: "Ponude",
      metric: "Broj ponuda",
      currentValue: 45,
      predictedValue: 52,
      confidence: 87,
      trend: "up"
    },
    {
      module: "Proizvodnja",
      metric: "Efikasnost",
      currentValue: 78,
      predictedValue: 82,
      confidence: 92,
      trend: "up"
    },
    {
      module: "Troškovi",
      metric: "Operativni troškovi",
      currentValue: 12500,
      predictedValue: 11800,
      confidence: 85,
      trend: "down"
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const handleSaveConfig = async () => {
    try {
      // Simulacija čuvanja konfiguracije
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("AI konfiguracija je uspješno sačuvana");
    } catch (error) {
      toast.error("Greška pri čuvanju konfiguracije");
    }
  };

  const runWorkflow = async (workflowId: string) => {
    try {
      setIsRunning(true);
      // Simulacija izvršavanja workflow-a
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { ...w, lastRun: new Date(), status: "active" as const }
          : w
      ));
      
      toast.success("Workflow je uspješno izvršen");
    } catch (error) {
      toast.error("Greška pri izvršavanju workflow-a");
    } finally {
      setIsRunning(false);
    }
  };

  const toggleWorkflow = async (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: w.status === "active" ? "inactive" : "active" }
        : w
    ));
  };

  const generatePrediction = async () => {
    try {
      setIsRunning(true);
      // Simulacija generisanja predviđanja
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const newPrediction: AIPrediction = {
        module: "Novi Modul",
        metric: "Nova Metrika",
        currentValue: Math.floor(Math.random() * 100),
        predictedValue: Math.floor(Math.random() * 100),
        confidence: Math.floor(Math.random() * 20) + 80,
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as "up" | "down" | "stable"
      };
      
      setPredictions(prev => [...prev, newPrediction]);
      toast.success("Novo predviđanje je generisano");
    } catch (error) {
      toast.error("Greška pri generisanju predviđanja");
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "error": return "destructive";
      default: return "outline";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "down": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "stable": return <BarChart3 className="h-4 w-4 text-blue-500" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Integracija</h2>
          <p className="text-muted-foreground">
            Napredna AI automatizacija i predviđanja
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={generatePrediction}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            {isRunning ? "Generisanje..." : "Generiši Predviđanje"}
          </Button>
          <Button onClick={handleSaveConfig} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Sačuvaj Konfiguraciju
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Workflows
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Predviđanja
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Konfiguracija
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        {workflow.name}
                      </CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(workflow.status)}>
                        {workflow.status === "active" ? "Aktivan" : 
                         workflow.status === "inactive" ? "Neaktivan" : "Greška"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWorkflow(workflow.id)}
                      >
                        {workflow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Trigger:</span>
                        <span className="ml-2 capitalize">{workflow.trigger}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Zadnje izvršavanje:</span>
                        <span className="ml-2">{workflow.lastRun.toLocaleDateString()}</span>
                      </div>
                      {workflow.nextRun && (
                        <div>
                          <span className="text-muted-foreground">Sljedeće izvršavanje:</span>
                          <span className="ml-2">{workflow.nextRun.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Akcije:</h4>
                      <div className="space-y-2">
                        {workflow.actions.map((action, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={action.enabled}
                                onCheckedChange={(checked) => {
                                  setWorkflows(prev => prev.map(w => 
                                    w.id === workflow.id 
                                      ? {
                                          ...w,
                                          actions: w.actions.map((a, i) => 
                                            i === index ? { ...a, enabled: checked } : a
                                          )
                                        }
                                      : w
                                  ));
                                }}
                              />
                              <span className="text-sm capitalize">
                                {action.type.replace("_", " ")}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {action.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => runWorkflow(workflow.id)}
                      disabled={isRunning}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      {isRunning ? "Izvršavanje..." : "Pokreni Workflow"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Predviđanja</CardTitle>
              <CardDescription>
                Predviđanja bazirana na analizi podataka
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {predictions.map((prediction, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{prediction.module}</CardTitle>
                      <CardDescription>{prediction.metric}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trenutno:</span>
                          <span className="font-semibold">{prediction.currentValue}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Predviđeno:</span>
                          <span className="font-semibold">{prediction.predictedValue}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Pouzdanost:</span>
                          <span className="font-semibold">{prediction.confidence}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trend:</span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(prediction.trend)}
                            <span className="capitalize">{prediction.trend}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Konfiguracija
                </CardTitle>
                <CardDescription>
                  Osnovne postavke AI integracije
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ai-enabled"
                    checked={aiEnabled}
                    onCheckedChange={setAiEnabled}
                  />
                  <Label htmlFor="ai-enabled">Omogući AI funkcionalnosti</Label>
                </div>

                <div>
                  <Label htmlFor="ai-model">AI Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude">Claude</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="api-key">API Ključ</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Unesite API ključ"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => toast.success("AI konfiguracija testirana")}
                >
                  <TestTube className="h-4 w-4" />
                  Testiraj Konekciju
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Promptovi
                </CardTitle>
                <CardDescription>
                  Prilagođeni promptovi za različite zadatke
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="analysis-prompt">Prompt za Analizu</Label>
                  <Textarea
                    id="analysis-prompt"
                    placeholder="Unesite prompt za analizu podataka..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="prediction-prompt">Prompt za Predviđanja</Label>
                  <Textarea
                    id="prediction-prompt"
                    placeholder="Unesite prompt za predviđanja..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="report-prompt">Prompt za Izvještaje</Label>
                  <Textarea
                    id="report-prompt"
                    placeholder="Unesite prompt za generisanje izvještaja..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 