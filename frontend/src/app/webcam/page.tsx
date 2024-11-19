'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
// import { Progress } from "@/components/ui/progress"
import Script from 'next/script'

export default function WebcamPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null) // Hidden canvas for capturing frames
  const [error, setError] = useState<string | null>(null)
  const [isStreamActive, setIsStreamActive] = useState(false)
  const [chatResult, setChatResult] = useState<string>('');
  
  // State to store detected emotion
  const [detectedEmotion, setDetectedEmotion] = useState<{ emotion: string, confidence: number } | null>(null)

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

  // Function to capture a frame and send it to the backend
  const captureAndClassifyFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) {
      // console.error('Unable to get canvas context')
      return
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current frame from the video onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get the data URL of the image (base64 encoded)
    const dataURL = canvas.toDataURL('image/jpeg')
    try {
      const response = await fetch('http://localhost:5000/classify_emotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: dataURL })
      })

      if (!response.ok) {
        const errorData = await response.json()
        // console.error('Error from backend:', errorData)
        return
      }

      const result = await response.json()
      console.log(result.emotions[0])
      setDetectedEmotion({
        emotion: result.emotions[0].emotion,
        confidence: result.emotions[0].confidence
      })
    } catch (err) {
      // console.error('Error sending image to backend:', err)
    }
  }

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreamActive(true)
        setError(null)
      }
    } catch (err) {
      // console.error('Error accessing the webcam:', err)
      setError('Unable to access the webcam. Please make sure you have a webcam connected and you have granted permission to use it.')
    }
  }

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsStreamActive(false)
      setDetectedEmotion(null) // Clear detected emotion
    }
  }

  const handleChatRequest = async () => {
    const payload = {
      messages: [
        {
          role: "user",
          content: "Give me a positive affirmation. Keep it to two sentences.",
        },
      ],
    };


    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let chunk = '';

      // Read the stream as it arrives
      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        // Convert the value from a Uint8Array to a string and append it to the chunk
        chunk += decoder.decode(value, { stream: true });
        
        // Optionally, handle the chunk (e.g., display or process it)
        // console.log(chunk);
      }

      // After the stream is fully read, handle the complete data
      const chunks = chunk.split('\n');
      const chunksJSON: any[] = [];

      for (let i = 0; i < chunks.length; i++) {
        let ck = chunks[i];
        if (ck === "" || ck === "data: [DONE]" || ck == undefined) {
          continue;
        } else {
          chunksJSON.push(JSON.parse(ck.split('data: ')[1]))
        }
      }

      let chatResultTemp = '';
      for (let i = 0; i < chunksJSON.length; i++) {
        chatResultTemp += chunksJSON[i].choices[0].delta.content;
      }

      console.log(chatResultTemp)
      setChatResult(chatResultTemp);

    } catch (err: any) {
      setError(err.message);  // Handle error
    }
  };

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
    setInterval(() => {
      handleChatRequest();
    }, 5000)
  }, []);

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

  // Effect to start capturing and classifying frames when webcam is active
  useEffect(() => {
    let classifyInterval: NodeJS.Timeout

    if (isStreamActive) {
      // Start classifying frames every 5 seconds
      classifyInterval = setInterval(() => {
        captureAndClassifyFrame()
      }, 1000) // Adjust interval as needed
    }

    return () => {
      if (classifyInterval) clearInterval(classifyInterval)
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
          <img    
          src="ripple.png"
          alt="Background Overlay"
          className="absolute inset-0 object-cover w-full h-full opacity-30"
          />
        <h1 className="text-2xl font-bold mb-4 text-white">Match the Emotion!</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {detectedEmotion && (
          <div className="mb-4 p-2 bg-white bg-opacity-50 rounded">
            <p className="text-gray-800">Detected Emotion: <strong>{detectedEmotion.emotion}</strong></p>
            <p className="text-gray-800">Confidence: <strong>{detectedEmotion.confidence.toFixed(2)}%</strong></p>
          </div>
        )}

        <div className="relative" ref={videoContainerRef}>
          <img
            src="lilypad.png"
            alt="Lilypad"
            className="absolute -bottom-24 -right-20 w-60 h-60"
          />
          <img
            src={animationFrames[currentEmotionIndex][currentFrameIndex]}
            alt="Animated Mascot"
            className="absolute -bottom-20 -right-20 w-60 h-60"
          />
          <div className="rounded-md bg-white absolute -right-24 bottom-36 w-48 p-4">
            <p>{chatResult}</p>
          </div>
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
          {/* Hidden canvas element */}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
        <div className="mt-4 z-[9999]">
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
            alt="Flower"
            className="object-contain w-20 h-20 -rotate-12"
          />
        </div>
      </div>
    </>
  )
}
