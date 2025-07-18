"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Activity,
  DollarSign,
  Package,
  Users,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface AnalyticsData {
  period: string;
  ponude: number;
  radniNalozi: number;
  pilana: number;
  dorada: number;
  prijemTrupaca: number;
  blagajna: number;
  revenue: number;
  users: number;
}

interface PerformanceMetrics {
  efficiency: number;
  accuracy: number;
  speed: number;
  quality: number;
}

export default function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedModule, setSelectedModule] = useState("all");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    efficiency: 87.3,
    accuracy: 94.1,
    speed: 78.9,
    quality: 91.5
  });
  const [loading, setLoading] = useState(false);

  // Simulacija podataka za analitiku
  useEffect(() => {
    const generateData = () => {
      const data: AnalyticsData[] = [];
      const periods = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun"];
      
      periods.forEach((period, index) => {
        data.push({
          period,
          ponude: 45 + Math.floor(Math.random() * 30),
          radniNalozi: 32 + Math.floor(Math.random() * 20),
          pilana: 28 + Math.floor(Math.random() * 25),
          dorada: 15 + Math.floor(Math.random() * 15),
          prijemTrupaca: 67 + Math.floor(Math.random() * 35),
          blagajna: 89 + Math.floor(Math.random() * 50),
          revenue: 35000 + Math.floor(Math.random() * 20000),
          users: 8 + Math.floor(Math.random() * 5)
        });
      });
      
      setAnalyticsData(data);
    };

    generateData();
  }, []);

  const exportAnalytics = async (format: "pdf" | "excel" | "csv") => {
    try {
      setLoading(true);
      // Simulacija exporta
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Analitika je uspješno eksportovana u ${format.toUpperCase()} format`);
    } catch (error) {
      toast.error("Greška pri exportu analitike");
    } finally {
      setLoading(false);
    }
  };

  const getGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (rate: number) => {
    return rate >= 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const currentData = analyticsData[analyticsData.length - 1];
  const previousData = analyticsData[analyticsData.length - 2];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analitika i Dashboard</h2>
          <p className="text-muted-foreground">
            Napredna analiza podataka i performansi sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dana</SelectItem>
              <SelectItem value="30">30 dana</SelectItem>
              <SelectItem value="90">90 dana</SelectItem>
              <SelectItem value="365">Godina</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => exportAnalytics("pdf")}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Ključni pokazatelji */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukupan Prihod</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{currentData?.revenue?.toLocaleString() || "0"}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(getGrowthRate(currentData?.revenue || 0, previousData?.revenue || 0))}
              {Math.abs(getGrowthRate(currentData?.revenue || 0, previousData?.revenue || 0)).toFixed(1)}% od prošlog perioda
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivne Ponude</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData?.ponude || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(getGrowthRate(currentData?.ponude || 0, previousData?.ponude || 0))}
              {Math.abs(getGrowthRate(currentData?.ponude || 0, previousData?.ponude || 0)).toFixed(1)}% od prošlog perioda
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Radni Nalozi</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData?.radniNalozi || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(getGrowthRate(currentData?.radniNalozi || 0, previousData?.radniNalozi || 0))}
              {Math.abs(getGrowthRate(currentData?.radniNalozi || 0, previousData?.radniNalozi || 0)).toFixed(1)}% od prošlog perioda
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivni Korisnici</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentData?.users || 0}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(getGrowthRate(currentData?.users || 0, previousData?.users || 0))}
              {Math.abs(getGrowthRate(currentData?.users || 0, previousData?.users || 0)).toFixed(1)}% od prošlog perioda
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grafikoni i analitika */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Pregled
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performanse
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Trendovi
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Distribucija
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Aktivnost po Modulima</CardTitle>
                <CardDescription>Pregled aktivnosti u različitim modulima</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Ponude", value: currentData?.ponude || 0, color: "bg-blue-500" },
                    { name: "Radni Nalozi", value: currentData?.radniNalozi || 0, color: "bg-green-500" },
                    { name: "Pilana", value: currentData?.pilana || 0, color: "bg-yellow-500" },
                    { name: "Dorada", value: currentData?.dorada || 0, color: "bg-purple-500" },
                    { name: "Prijem Trupaca", value: currentData?.prijemTrupaca || 0, color: "bg-orange-500" },
                    { name: "Blagajna", value: currentData?.blagajna || 0, color: "bg-red-500" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Finansijski Pregled</CardTitle>
                <CardDescription>Prihod i troškovi po periodima</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/50">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Grafikon finansijskog pregleda</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Efikasnost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics.efficiency}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${performanceMetrics.efficiency}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preciznost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics.accuracy}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${performanceMetrics.accuracy}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Brzina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics.speed}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${performanceMetrics.speed}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Kvalitet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceMetrics.quality}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${performanceMetrics.quality}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detaljna Analiza Performansi</CardTitle>
              <CardDescription>Pregled ključnih pokazatelja performansi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Detaljni grafikon performansi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analiza</CardTitle>
              <CardDescription>Praćenje trendova kroz vrijeme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Grafikon trendova</p>
                  <p className="text-sm text-muted-foreground">Podaci: {analyticsData.length} perioda</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribucija Aktivnosti</CardTitle>
              <CardDescription>Udio različitih aktivnosti u ukupnom radu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Kružni grafikon distribucije</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Napredni izvještaji */}
      <Card>
        <CardHeader>
          <CardTitle>Napredni Izvještaji</CardTitle>
          <CardDescription>Generišite specifične izvještaje za analizu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dnevni Izvještaj
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Finansijski Izvještaj
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Izvještaj Performansi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 