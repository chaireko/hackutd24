'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import Script from 'next/script'

export default function WebcamPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (isStreamActive && videoContainerRef.current) {
      // @ts-ignore
      $(videoContainerRef.current).ripples({
        resolution: 512,
        dropRadius: 20,
        perturbance: 0.04,
      })
    }

    return () => {
      if (videoContainerRef.current) {
        // @ts-ignore
        $(videoContainerRef.current).ripples('destroy')
      }
    }
  }, [isStreamActive])

  return (
    <>
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js" />
      <Script src="https://www.jqueryscript.net/demo/jQuery-Plugin-For-Water-Ripple-Animation-ripples/js/jquery.ripples.js" />
      
      <div className="flex flex-col items-center justify-center min-h-screen p-4"
        style={{
          background: 'linear-gradient(180deg, #6893FF 0%, #72FFD2 100%)'
        }}>
        <h1 className="text-2xl font-bold mb-4 text-white">match the emotion!</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="relative" ref={videoContainerRef}>
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
        <img
          src="mascot.png"
          alt="mascot"
          className="absolute bottom-11 right-20 w-24 h-24"
        />
        <div className="mt-4">
          <Button onClick={startWebcam} disabled={isStreamActive} className="mr-2">
            Start Webcam
          </Button>
          <Button onClick={stopWebcam} disabled={!isStreamActive} variant="outline">
            Stop Webcam
          </Button>
        </div>
        <div className="absolute bottom-0 right-0 p-4">
          <img 
            src="lilypad_topleft.png"
            alt="Lilypad"
            className="object-contain w-40 h-40 rotate-180"
          />
        </div>
        <div className="absolute bottom-16 right-8 p-4">
          <img
            src="flower_lilypad.png"
            alt="flower"
            className="object-contain w-20 h-20 -rotate-12"
          />
        </div>
      </div>
    </>
  )
}