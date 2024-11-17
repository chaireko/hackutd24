'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import * as tf from "@tensorflow/tfjs";

export default function WebcamPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isStreamActive, setIsStreamActive] = useState(false)

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreamActive(true)
        setError(null)
      }
    } catch (err) {
      console.error('Error accessing the webcam:', err)
      setError('Unable to access the webcam. Please make sure you have a webcam connected and you have granted permission to use it.')
    }
  }

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsStreamActive(false)
    }
  }

  useEffect(() => {
        return () => {
      stopWebcam()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Webcam Page</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-lg shadow-lg max-w-full h-auto"
          style={{ display: isStreamActive ? 'block' : 'none' }}
        />
        {!isStreamActive && (
          <div className="w-[640px] h-[480px] bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Webcam is off</p>
          </div>
        )}
      </div>
      <div className="mt-4">
        <Button onClick={startWebcam} disabled={isStreamActive} className="mr-2">
          Start Webcam
        </Button>
        <Button onClick={stopWebcam} disabled={!isStreamActive} variant="outline">
          Stop Webcam
        </Button>
      </div>
    </div>
  )
}