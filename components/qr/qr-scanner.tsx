"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, X, Flashlight, FlashlightOff } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
  title?: string
  description?: string
}

export function QRScanner({ onScan, onClose, title = "QR Skener", description = "Skenirajte QR kod" }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")
  const [hasFlash, setHasFlash] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Zadnja kamera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream

        // Provjeri da li ima flash
        const track = stream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        setHasFlash("torch" in capabilities)
      }
      setIsScanning(true)
    } catch (err) {
      setError("Greška pri pristupu kameri. Molimo dozvolite pristup kameri.")
      console.error("Camera error:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const toggleFlash = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0]
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashOn }],
        })
        setFlashOn(!flashOn)
      } catch (err) {
        console.error("Flash error:", err)
      }
    }
  }

  // Mock QR detection - u stvarnoj aplikaciji koristiti pravu QR biblioteku
  const handleVideoClick = () => {
    // Simulacija skeniranja QR koda
    const mockQRData = `QR-${Date.now()}`
    onScan(mockQRData)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="qr-scanner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-black rounded-lg cursor-pointer"
                onClick={handleVideoClick}
              />
              <div className="qr-overlay" />

              <div className="flex justify-center gap-2 mt-4">
                {hasFlash && (
                  <Button variant="outline" size="icon" onClick={toggleFlash}>
                    {flashOn ? <FlashlightOff className="h-4 w-4" /> : <Flashlight className="h-4 w-4" />}
                  </Button>
                )}
                <Button variant="outline" onClick={startCamera} disabled={isScanning}>
                  {isScanning ? "Skeniranje..." : "Pokreni kameru"}
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>Postavite QR kod u okvir i kliknite na video za skeniranje</p>
            <p className="text-xs mt-1">Demo verzija - klik na video generiše test QR kod</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
