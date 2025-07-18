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
import { Printer, Network, FileText, Settings, Save, TestTube } from "lucide-react";
import { toast } from "sonner";

interface PrintSettings {
  networkPrinter: {
    enabled: boolean;
    ip: string;
    port: string;
    protocol: "http" | "https" | "ipp";
    name: string;
  };
  printOptions: {
    orientation: "portrait" | "landscape";
    paperSize: "A4" | "A3" | "Letter" | "Legal";
    margins: number;
    headerFooter: boolean;
    pageNumbers: boolean;
    dateTime: boolean;
  };
  customCommands: {
    prePrint: string;
    postPrint: string;
  };
}

export default function PrintSettings() {
  const [settings, setSettings] = useState<PrintSettings>({
    networkPrinter: {
      enabled: false,
      ip: "",
      port: "631",
      protocol: "ipp",
      name: ""
    },
    printOptions: {
      orientation: "portrait",
      paperSize: "A4",
      margins: 10,
      headerFooter: true,
      pageNumbers: true,
      dateTime: true
    },
    customCommands: {
      prePrint: "",
      postPrint: ""
    }
  });

  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    try {
      // Simulacija čuvanja postavki
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Postavke printa su uspješno sačuvane");
    } catch (error) {
      toast.error("Greška pri čuvanju postavki");
    }
  };

  const testNetworkPrinter = async () => {
    if (!settings.networkPrinter.enabled || !settings.networkPrinter.ip) {
      toast.error("Omogućite mrežni printer i unesite IP adresu");
      return;
    }

    setIsTesting(true);
    try {
      // Simulacija testiranja mrežnog printera
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Mrežni printer je dostupan i spreman za korištenje");
    } catch (error) {
      toast.error("Greška pri povezivanju s mrežnim printerom");
    } finally {
      setIsTesting(false);
    }
  };

  const scanNetworkPrinters = async () => {
    try {
      // Simulacija skeniranja mrežnih printera
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success("Pronađeno 3 mrežna printera");
    } catch (error) {
      toast.error("Greška pri skeniranju mrežnih printera");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Postavke Printa</h2>
          <p className="text-muted-foreground">
            Konfigurišite napredne opcije za print i mrežne printere
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Sačuvaj Postavke
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mrežni Printer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Mrežni Printer
            </CardTitle>
            <CardDescription>
              Konfigurišite mrežni printer za direktno slanje dokumenata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="network-printer"
                checked={settings.networkPrinter.enabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({
                    ...prev,
                    networkPrinter: { ...prev.networkPrinter, enabled: checked }
                  }))
                }
              />
              <Label htmlFor="network-printer">Omogući mrežni printer</Label>
            </div>

            {settings.networkPrinter.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="printer-ip">IP Adresa</Label>
                    <Input
                      id="printer-ip"
                      placeholder="192.168.1.100"
                      value={settings.networkPrinter.ip}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          networkPrinter: { ...prev.networkPrinter, ip: e.target.value }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="printer-port">Port</Label>
                    <Input
                      id="printer-port"
                      placeholder="631"
                      value={settings.networkPrinter.port}
                      onChange={(e) =>
                        setSettings(prev => ({
                          ...prev,
                          networkPrinter: { ...prev.networkPrinter, port: e.target.value }
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="printer-protocol">Protokol</Label>
                  <Select
                    value={settings.networkPrinter.protocol}
                    onValueChange={(value: "http" | "https" | "ipp") =>
                      setSettings(prev => ({
                        ...prev,
                        networkPrinter: { ...prev.networkPrinter, protocol: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ipp">IPP (Internet Printing Protocol)</SelectItem>
                      <SelectItem value="http">HTTP</SelectItem>
                      <SelectItem value="https">HTTPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="printer-name">Naziv Printera</Label>
                  <Input
                    id="printer-name"
                    placeholder="HP LaserJet Pro"
                    value={settings.networkPrinter.name}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        networkPrinter: { ...prev.networkPrinter, name: e.target.value }
                      }))
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={testNetworkPrinter}
                    disabled={isTesting}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <TestTube className="h-4 w-4" />
                    {isTesting ? "Testiranje..." : "Testiraj Konekciju"}
                  </Button>
                  <Button
                    onClick={scanNetworkPrinters}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Network className="h-4 w-4" />
                    Skeniraj Printere
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Opcije Printa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Opcije Printa
            </CardTitle>
            <CardDescription>
              Prilagodite izgled i format ispisa dokumenata
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orientation">Orijentacija</Label>
                <Select
                  value={settings.printOptions.orientation}
                  onValueChange={(value: "portrait" | "landscape") =>
                    setSettings(prev => ({
                      ...prev,
                      printOptions: { ...prev.printOptions, orientation: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portret</SelectItem>
                    <SelectItem value="landscape">Pejzaž</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paper-size">Veličina Papira</Label>
                <Select
                  value={settings.printOptions.paperSize}
                  onValueChange={(value: "A4" | "A3" | "Letter" | "Legal") =>
                    setSettings(prev => ({
                      ...prev,
                      printOptions: { ...prev.printOptions, paperSize: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="A3">A3</SelectItem>
                    <SelectItem value="Letter">Letter</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="margins">Margine (mm)</Label>
              <Input
                id="margins"
                type="number"
                min="0"
                max="50"
                value={settings.printOptions.margins}
                onChange={(e) =>
                  setSettings(prev => ({
                    ...prev,
                    printOptions: { ...prev.printOptions, margins: parseInt(e.target.value) }
                  }))
                }
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="header-footer"
                  checked={settings.printOptions.headerFooter}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      printOptions: { ...prev.printOptions, headerFooter: checked }
                    }))
                  }
                />
                <Label htmlFor="header-footer">Zaglavlje i podnožje</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="page-numbers"
                  checked={settings.printOptions.pageNumbers}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      printOptions: { ...prev.printOptions, pageNumbers: checked }
                    }))
                  }
                />
                <Label htmlFor="page-numbers">Brojevi stranica</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="date-time"
                  checked={settings.printOptions.dateTime}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      printOptions: { ...prev.printOptions, dateTime: checked }
                    }))
                  }
                />
                <Label htmlFor="date-time">Datum i vrijeme</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prilagođene Komande */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Prilagođene Komande
          </CardTitle>
          <CardDescription>
            Dodajte prilagođene komande koje se izvršavaju prije i nakon printa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pre-print">Komanda prije printa</Label>
            <Textarea
              id="pre-print"
              placeholder="npr. echo 'Početak printa' >> /var/log/printer.log"
              value={settings.customCommands.prePrint}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  customCommands: { ...prev.customCommands, prePrint: e.target.value }
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="post-print">Komanda nakon printa</Label>
            <Textarea
              id="post-print"
              placeholder="npr. echo 'Završetak printa' >> /var/log/printer.log"
              value={settings.customCommands.postPrint}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  customCommands: { ...prev.customCommands, postPrint: e.target.value }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Status Printera */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Status Printera
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Lokalni Printer</p>
                <p className="text-sm text-muted-foreground">Default printer</p>
              </div>
              <Badge variant="default">Aktivan</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Mrežni Printer</p>
                <p className="text-sm text-muted-foreground">
                  {settings.networkPrinter.enabled ? settings.networkPrinter.ip : "Nije konfigurisan"}
                </p>
              </div>
              <Badge variant={settings.networkPrinter.enabled ? "default" : "secondary"}>
                {settings.networkPrinter.enabled ? "Aktivan" : "Neaktivan"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">PDF Export</p>
                <p className="text-sm text-muted-foreground">Virtual printer</p>
              </div>
              <Badge variant="default">Aktivan</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 