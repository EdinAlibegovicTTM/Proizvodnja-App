"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  Download, 
  Filter,
  Calendar,
  DollarSign,
  Package,
  Users,
  Activity
} from "lucide-react";
import { toast } from "sonner";

interface ReportData {
  period: string;
  ponude: number;
  radniNalozi: number;
  pilana: number;
  dorada: number;
  prijemTrupaca: number;
  blagajna: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }[];
}

export default function AdvancedReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedModule, setSelectedModule] = useState("all");

  // Simulacija podataka za izvještaje
  const reportData: ReportData[] = [
    { period: "Jan", ponude: 45, radniNalozi: 32, pilana: 28, dorada: 15, prijemTrupaca: 67, blagajna: 89 },
    { period: "Feb", ponude: 52, radniNalozi: 38, pilana: 35, dorada: 18, prijemTrupaca: 72, blagajna: 95 },
    { period: "Mar", ponude: 48, radniNalozi: 41, pilana: 42, dorada: 22, prijemTrupaca: 78, blagajna: 102 },
    { period: "Apr", ponude: 61, radniNalozi: 45, pilana: 38, dorada: 25, prijemTrupaca: 85, blagajna: 118 },
    { period: "Maj", ponude: 55, radniNalozi: 49, pilana: 45, dorada: 28, prijemTrupaca: 92, blagajna: 125 },
    { period: "Jun", ponude: 67, radniNalozi: 52, pilana: 51, dorada: 32, prijemTrupaca: 98, blagajna: 135 }
  ];

  const generateChartData = (type: "bar" | "line" | "pie"): ChartData => {
    const labels = reportData.map(item => item.period);
    const datasets = [
      {
        label: "Ponude",
        data: reportData.map(item => item.ponude),
        backgroundColor: type === "pie" ? ["#3B82F6", "#1D4ED8", "#1E40AF", "#1E3A8A", "#1E293B", "#0F172A"] : undefined,
        borderColor: type !== "pie" ? "#3B82F6" : undefined
      },
      {
        label: "Radni Nalozi",
        data: reportData.map(item => item.radniNalozi),
        backgroundColor: type === "pie" ? ["#10B981", "#059669", "#047857", "#065F46", "#064E3B", "#022C22"] : undefined,
        borderColor: type !== "pie" ? "#10B981" : undefined
      },
      {
        label: "Pilana",
        data: reportData.map(item => item.pilana),
        backgroundColor: type === "pie" ? ["#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F", "#451A03"] : undefined,
        borderColor: type !== "pie" ? "#F59E0B" : undefined
      }
    ];

    return { labels, datasets };
  };

  const exportReport = async (format: "pdf" | "excel" | "csv") => {
    try {
      // Simulacija exporta
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Izvještaj je uspješno eksportovan u ${format.toUpperCase()} format`);
    } catch (error) {
      toast.error("Greška pri exportu izvještaja");
    }
  };

  const generateCustomReport = async () => {
    try {
      // Simulacija generisanja prilagođenog izvještaja
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success("Prilagođeni izvještaj je uspješno generisan");
    } catch (error) {
      toast.error("Greška pri generisanju izvještaja");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Napredni Izvještaji</h2>
          <p className="text-muted-foreground">
            Analizirajte podatke i generišite detaljne izvještaje
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport("pdf")} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport("excel")} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filteri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filteri i Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="period">Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Zadnjih 7 dana</SelectItem>
                  <SelectItem value="30">Zadnjih 30 dana</SelectItem>
                  <SelectItem value="90">Zadnjih 90 dana</SelectItem>
                  <SelectItem value="365">Zadnjih godinu dana</SelectItem>
                  <SelectItem value="custom">Prilagođeno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="module">Modul</Label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Svi moduli</SelectItem>
                  <SelectItem value="ponude">Ponude</SelectItem>
                  <SelectItem value="radni-nalozi">Radni Nalozi</SelectItem>
                  <SelectItem value="pilana">Pilana</SelectItem>
                  <SelectItem value="dorada">Dorada</SelectItem>
                  <SelectItem value="prijem-trupaca">Prijem Trupaca</SelectItem>
                  <SelectItem value="blagajna">Blagajna</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Početni datum</Label>
              <Input
                type="date"
                value={startDate?.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </div>
            <div>
              <Label>Završni datum</Label>
              <Input
                type="date"
                value={endDate?.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistike */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukupno Ponuda</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-muted-foreground">
              +20.1% od prošlog mjeseca
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivni Radni Nalozi</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +12.5% od prošlog mjeseca
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ukupan Prihod</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +18.2% od prošlog mjeseca
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktivni Korisnici</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 od prošlog mjeseca
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafikoni */}
      <Tabs defaultValue="bar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bar" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Stupčasti Grafikon
          </TabsTrigger>
          <TabsTrigger value="line" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Linijski Grafikon
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Kružni Grafikon
          </TabsTrigger>
          <TabsTrigger value="trend" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trend Analiza
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktivnost po Modulima - Stupčasti Grafikon</CardTitle>
              <CardDescription>
                Prikaz aktivnosti u različitim modulima kroz vrijeme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Stupčasti grafikon aktivnosti</p>
                  <p className="text-sm text-muted-foreground">Podaci: {reportData.length} mjeseci</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Aktivnosti - Linijski Grafikon</CardTitle>
              <CardDescription>
                Praćenje trenda aktivnosti kroz vrijeme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Linijski grafikon trenda</p>
                  <p className="text-sm text-muted-foreground">Podaci: {reportData.length} mjeseci</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribucija Aktivnosti - Kružni Grafikon</CardTitle>
              <CardDescription>
                Udio različitih modula u ukupnoj aktivnosti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/50">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Kružni grafikon distribucije</p>
                  <p className="text-sm text-muted-foreground">6 modula</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analiza Trenda</CardTitle>
              <CardDescription>
                Detaljna analiza trendova i predviđanja
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Rast Ponuda</h4>
                    <div className="text-2xl font-bold text-green-600">+15.2%</div>
                    <p className="text-sm text-muted-foreground">Mjesečni rast</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Efikasnost</h4>
                    <div className="text-2xl font-bold text-blue-600">87.3%</div>
                    <p className="text-sm text-muted-foreground">Prosječna efikasnost</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Predviđanje</h4>
                    <div className="text-2xl font-bold text-purple-600">+22%</div>
                    <p className="text-sm text-muted-foreground">Sljedeći kvartal</p>
                  </div>
                </div>
                <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/50">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Grafikon trenda i predviđanja</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Prilagođeni Izvještaji */}
      <Card>
        <CardHeader>
          <CardTitle>Prilagođeni Izvještaji</CardTitle>
          <CardDescription>
            Generišite specifične izvještaje prema vašim potrebama
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold">Tipovi Izvještaja</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={generateCustomReport}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Dnevni Izvještaj Aktivnosti
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={generateCustomReport}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Finansijski Izvještaj
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={generateCustomReport}>
                  <Package className="h-4 w-4 mr-2" />
                  Izvještaj Proizvodnje
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={generateCustomReport}>
                  <Users className="h-4 w-4 mr-2" />
                  Izvještaj Korisnika
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Brzi Export</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => exportReport("pdf")}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF - Svi Moduli
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => exportReport("excel")}>
                  <Download className="h-4 w-4 mr-2" />
                  Excel - Finansijski Podaci
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => exportReport("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV - Statistike
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 