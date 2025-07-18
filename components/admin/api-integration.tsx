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
  Webhook, 
  Globe, 
  Settings, 
  Key, 
  TestTube, 
  Play,
  Pause,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  FileText
} from "lucide-react";
import { toast } from "sonner";

interface APIEndpoint {
  id: string;
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description: string;
  status: "active" | "inactive" | "error";
  lastCall?: Date;
  callCount: number;
  successRate: number;
  averageResponseTime: number;
  headers: Record<string, string>;
  authentication: "none" | "api_key" | "bearer" | "oauth2";
  apiKey?: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "inactive" | "error";
  lastTriggered?: Date;
  triggerCount: number;
  successRate: number;
  secret?: string;
  headers: Record<string, string>;
  retryCount: number;
  timeout: number;
}

interface APILog {
  id: string;
  endpoint: string;
  method: string;
  status: number;
  responseTime: number;
  timestamp: Date;
  requestBody?: string;
  responseBody?: string;
  error?: string;
}

export default function APIIntegration() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
    {
      id: "1",
      name: "ERP Integracija",
      url: "https://api.erp-system.com/v1",
      method: "POST",
      description: "Integracija sa ERP sistemom",
      status: "active",
      lastCall: new Date(Date.now() - 30 * 60 * 1000),
      callCount: 1250,
      successRate: 98.5,
      averageResponseTime: 245,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      authentication: "api_key",
      apiKey: "sk-1234567890abcdef"
    },
    {
      id: "2",
      name: "SMS Servis",
      url: "https://api.sms-provider.com/send",
      method: "POST",
      description: "Slanje SMS obavještenja",
      status: "active",
      lastCall: new Date(Date.now() - 2 * 60 * 60 * 1000),
      callCount: 89,
      successRate: 99.1,
      averageResponseTime: 180,
      headers: {
        "Content-Type": "application/json"
      },
      authentication: "bearer"
    }
  ]);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: "1",
      name: "Ponuda Kreirana",
      url: "https://webhook.site/abc123",
      events: ["ponuda.created", "ponuda.updated"],
      status: "active",
      lastTriggered: new Date(Date.now() - 15 * 60 * 1000),
      triggerCount: 45,
      successRate: 97.8,
      retryCount: 3,
      timeout: 30,
      headers: {
        "Content-Type": "application/json"
      }
    },
    {
      id: "2",
      name: "Radni Nalog Završen",
      url: "https://api.external-system.com/webhook",
      events: ["radni_nalog.completed"],
      status: "active",
      lastTriggered: new Date(Date.now() - 1 * 60 * 60 * 1000),
      triggerCount: 12,
      successRate: 100,
      retryCount: 2,
      timeout: 15,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "webhook-secret-key"
      }
    }
  ]);

  const [apiLogs, setApiLogs] = useState<APILog[]>([
    {
      id: "1",
      endpoint: "/api/erp/orders",
      method: "POST",
      status: 200,
      responseTime: 245,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      requestBody: '{"order_id": "12345", "status": "completed"}',
      responseBody: '{"success": true, "message": "Order updated"}'
    },
    {
      id: "2",
      endpoint: "/api/sms/send",
      method: "POST",
      status: 429,
      responseTime: 1200,
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      requestBody: '{"phone": "+38760123456", "message": "Test"}',
      error: "Rate limit exceeded"
    }
  ]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const testEndpoint = async (endpoint: APIEndpoint) => {
    try {
      setIsTesting(true);
      // Simulacija API poziva
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.1; // 90% uspješnost
      const responseTime = Math.floor(Math.random() * 500) + 100;
      
      const newLog: APILog = {
        id: Date.now().toString(),
        endpoint: endpoint.url,
        method: endpoint.method,
        status: success ? 200 : 500,
        responseTime,
        timestamp: new Date(),
        requestBody: '{"test": "data"}',
        responseBody: success ? '{"success": true}' : '{"error": "Test failed"}',
        error: success ? undefined : "Test error"
      };
      
      setApiLogs(prev => [newLog, ...prev]);
      
      setEndpoints(prev => prev.map(e => 
        e.id === endpoint.id 
          ? { 
              ...e, 
              lastCall: new Date(),
              callCount: e.callCount + 1,
              successRate: success ? Math.min(100, e.successRate + 0.1) : Math.max(0, e.successRate - 0.1),
              averageResponseTime: Math.floor((e.averageResponseTime + responseTime) / 2)
            }
          : e
      ));
      
      toast.success(success ? "API test uspješan" : "API test neuspješan");
    } catch (error) {
      toast.error("Greška pri testiranju API-ja");
    } finally {
      setIsTesting(false);
    }
  };

  const toggleEndpoint = (endpointId: string) => {
    setEndpoints(prev => prev.map(e => 
      e.id === endpointId 
        ? { ...e, status: e.status === "active" ? "inactive" : "active" }
        : e
    ));
  };

  const toggleWebhook = (webhookId: string) => {
    setWebhooks(prev => prev.map(w => 
      w.id === webhookId 
        ? { ...w, status: w.status === "active" ? "inactive" : "active" }
        : w
    ));
  };

  const copyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API ključ kopiran");
  };

  const generateWebhookSecret = () => {
    const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return secret;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "error": return "destructive";
      default: return "outline";
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "default";
      case "POST": return "default";
      case "PUT": return "outline";
      case "DELETE": return "destructive";
      case "PATCH": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive": return <Pause className="h-4 w-4 text-yellow-500" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API Integracije</h2>
          <p className="text-muted-foreground">
            Upravljanje API endpoint-ima i webhook-ovima
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novi Endpoint
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Novi Webhook
          </Button>
        </div>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="endpoints" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            API Endpoint-ovi
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhook-ovi
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            API Logovi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          <div className="grid gap-4">
            {endpoints.map((endpoint) => (
              <Card key={endpoint.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        {endpoint.name}
                      </CardTitle>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <Badge variant={getStatusColor(endpoint.status)}>
                        {endpoint.status === "active" ? "Aktivan" : 
                         endpoint.status === "inactive" ? "Neaktivan" : "Greška"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">URL</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={endpoint.url} readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <Label className="text-sm font-medium">Zadnji poziv</Label>
                        <div className="text-sm text-muted-foreground mt-1">
                          {endpoint.lastCall ? endpoint.lastCall.toLocaleString() : "Nikad"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Broj poziva</Label>
                        <div className="text-2xl font-bold">{endpoint.callCount}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Uspješnost</Label>
                        <div className="text-2xl font-bold text-green-600">{endpoint.successRate.toFixed(1)}%</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Prosječno vrijeme</Label>
                        <div className="text-2xl font-bold">{endpoint.averageResponseTime}ms</div>
                      </div>
                    </div>

                    {endpoint.authentication !== "none" && (
                      <div>
                        <Label className="text-sm font-medium">Autentikacija</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type={showApiKey ? "text" : "password"}
                            value={endpoint.apiKey || ""}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => endpoint.apiKey && copyApiKey(endpoint.apiKey)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => toggleEndpoint(endpoint.id)}
                      >
                        {endpoint.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {endpoint.status === "active" ? "Deaktiviraj" : "Aktiviraj"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => testEndpoint(endpoint)}
                        disabled={isTesting}
                      >
                        <TestTube className="h-4 w-4 mr-1" />
                        {isTesting ? "Testiranje..." : "Testiraj"}
                      </Button>
                      <Button variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="grid gap-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Webhook className="h-5 w-5" />
                        {webhook.name}
                      </CardTitle>
                      <CardDescription>{webhook.url}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(webhook.status)}
                      <Badge variant={getStatusColor(webhook.status)}>
                        {webhook.status === "active" ? "Aktivan" : 
                         webhook.status === "inactive" ? "Neaktivan" : "Greška"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Eventi</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {webhook.events.map((event, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <Label className="text-sm font-medium">Zadnji trigger</Label>
                        <div className="text-sm text-muted-foreground mt-1">
                          {webhook.lastTriggered ? webhook.lastTriggered.toLocaleString() : "Nikad"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Broj trigger-a</Label>
                        <div className="text-2xl font-bold">{webhook.triggerCount}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Uspješnost</Label>
                        <div className="text-2xl font-bold text-green-600">{webhook.successRate.toFixed(1)}%</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Retry</Label>
                        <div className="text-2xl font-bold">{webhook.retryCount}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => toggleWebhook(webhook.id)}
                      >
                        {webhook.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {webhook.status === "active" ? "Deaktiviraj" : "Aktiviraj"}
                      </Button>
                      <Button variant="outline">
                        <TestTube className="h-4 w-4 mr-1" />
                        Testiraj
                      </Button>
                      <Button variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Logovi</CardTitle>
              <CardDescription>
                Pregled svih API poziva i odgovora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiLogs.map((log) => (
                  <div key={log.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={log.status >= 400 ? "destructive" : "default"}>
                          {log.status}
                        </Badge>
                        <Badge variant="outline">{log.method}</Badge>
                        <span className="font-mono text-sm">{log.endpoint}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.timestamp.toLocaleString()}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Response Time:</span>
                        <span className="ml-2">{log.responseTime}ms</span>
                      </div>
                      {log.requestBody && (
                        <div>
                          <span className="text-muted-foreground">Request:</span>
                          <div className="mt-1 p-2 bg-muted rounded font-mono text-xs">
                            {log.requestBody}
                          </div>
                        </div>
                      )}
                      {log.responseBody && (
                        <div>
                          <span className="text-muted-foreground">Response:</span>
                          <div className="mt-1 p-2 bg-muted rounded font-mono text-xs">
                            {log.responseBody}
                          </div>
                        </div>
                      )}
                    </div>

                    {log.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <div className="text-sm text-red-800">
                          <strong>Error:</strong> {log.error}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 