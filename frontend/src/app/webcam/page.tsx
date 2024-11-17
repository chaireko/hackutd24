'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import Script from 'next/script'

export default function WebcamPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isStreamActive, setIsStreamActive] = useState(false)

  // Animation frame management
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0)
  const animationFrames = [
    ['animations/angry/angry-1.png', 'animations/angry/angry-2.png', 'animations/angry/angry-3.png', 
      'animations/angry/angry-4.png', 'animations/angry/angry-5.png', 'animations/angry/angry-6.png', 
      'animations/angry/angry-7.png'],
    ['animations/cry/cry-1.png', 'animations/cry/cry-2.png', 'animations/cry/cry-3.png', 'animations/cry/cry-4.png', 
    'animations/cry/cry-5.png', 'animations/cry/cry-6.png', 'animations/cry/cry-7.png', 'animations/cry/cry-8.png', 
    'animations/cry/cry-9.png', 'animations/cry/cry-10.png', 'animations/cry/cry-12.png', 
    'animations/cry/cry-13.png', 'animations/cry/cry-14.png', 'animations/cry/cry-15.png', 'animations/cry/cry-16.png', 
    'animations/cry/cry-17.png', 'animations/cry/cry-18.png', 'animations/cry/cry-19.png', 'animations/cry/cry-20.png', 
    'animations/cry/cry-21.png', 'animations/cry/cry-22.png', 'animations/cry/cry-23.png', 'animations/cry/cry-24.png', 
    'animations/cry/cry-25.png', 'animations/cry/cry-26.png', 'animations/cry/cry-27.png', 'animations/cry/cry-28.png', 
    'animations/cry/cry-29.png'],
      ['animations/happy/happy-1.png', 'animations/happy/happy-2.png', 'animations/happy/happy-3.png', 
    'animations/happy/happy-4.png', 'animations/happy/happy-5.png', 'animations/happy/happy-6.png', 
    'animations/happy/happy-7.png', 'animations/happy/happy-8.png', 'animations/happy/happy-9.png', 
    'animations/happy/happy-10.png', 'animations/happy/happy-11.png', 'animations/happy/happy-12.png', 
    'animations/happy/happy-13.png', 'animations/happy/happy-14.png', 'animations/happy/happy-15.png', 
    'animations/happy/happy-16.png'],
        ['animations/tired/tired-1.png', 'animations/tired/tired-2.png', 'animations/tired/tired-3.png', 
          'animations/tired/tired-4.png', 'animations/tired/tired-5.png', 'animations/tired/tired-6.png', 
          'animations/tired/tired-7.png', 'animations/tired/tired-8.png', 'animations/tired/tired-9.png', 
          'animations/tired/tired-10.png', 'animations/tired/tired-11.png', 'animations/tired/tired-12.png', 
          'animations/tired/tired-13.png', 'animations/tired/tired-14.png', 'animations/tired/tired-15.png', 
          'animations/tired/tired-16.png', 'animations/tired/tired-17.png', 'animations/tired/tired-18.png', 
          'animations/tired/tired-19.png', 'animations/tired/tired-20.png', 'animations/tired/tired-21.png', 
          'animations/tired/tired-22.png', 'animations/tired/tired-23.png', 'animations/tired/tired-24.png', 
          'animations/tired/tired-25.png', 'animations/tired/tired-26.png', 'animations/tired/tired-27.png', 
          'animations/tired/tired-28.png'],
  ]
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)

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

  // Handle emotion cycling
  useEffect(() => {
    const emotionInterval = setInterval(() => {
      setCurrentEmotionIndex(prev => (prev + 1) % animationFrames.length)
      setCurrentFrameIndex(0) // Reset frame index when emotion changes
    }, 5000) // Change emotion every 5 seconds

    return () => clearInterval(emotionInterval)
  }, [animationFrames.length])

  // Handle frame cycling for current emotion
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrameIndex(prev =>
        (prev + 1) % animationFrames[currentEmotionIndex].length
      )
    }, 200) // Adjust frame duration (e.g., 200ms per frame)

    return () => clearInterval(frameInterval)
  }, [currentEmotionIndex, animationFrames])

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
          <img
            src="lilypad.png"
            alt="lilypad"
            className="absolute -bottom-24 -right-20 w-60 h-60"
          />
          <img
            src={animationFrames[currentEmotionIndex][currentFrameIndex]}
            alt="animated mascot"
            className="absolute -bottom-20 -right-20 w-60 h-60"
          />
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
