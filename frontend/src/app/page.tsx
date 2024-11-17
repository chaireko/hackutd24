"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

export default function WebcamPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);

  // Function to start the webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing the webcam:', err);
      setError('Unable to access the webcam. Please make sure you have a webcam connected and you have granted permission to use it.');
    }
  };

  // Function to stop the webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div
      className="min-h-screen text-white font-inter"
      style={{
        background: 'linear-gradient(180deg, #6893FF 0%, #72FFD2 100%)'
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center">
        <img
          src="ripple.png"
          alt="Background Overlay"
          className="absolute inset-0 object-cover w-full h-full opacity-30"
        />
      </div>

      <main className="container mx-auto px-4 py-16">
        <div className="w-full h-48 mb-8">
          <svg viewBox="0 0 1000 100" className="w-full h-full">
            <path
              id="curve"
              d="M0,100 Q500,20 1000,100"
              fill="transparent"
            />
            <text className="fill-current text-8xl font-extrabold drop-shadow-lg">
              <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                ECHO
              </textPath>
            </text>
          </svg>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Button
            variant="outline"
            className="bg-white text-[#688BFF] hover:bg-blue-100 hover:text-[#688BFF] font-extrabold drop-shadow"
            onClick={startWebcam}
          >
            {isStreamActive ? 'Stop' : 'Play'}
          </Button>
        </div>

        <div className="absolute top-0 left-0 p-4">
          <img
            src="lilypad_topleft.png"
            alt="Lilypad"
            className="object-contain w-40 h-40"
          />
        </div>

        <div className="absolute top-0 left-0 p-4">
          <img
            src="flower_lilypad.png"
            alt="flower"
            className="object-contain w-20 h-20 -rotate-45"
          />
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

        <div className="border-l-8 border-white h-80 my-8"></div>

        {/* Video stream */}
        <div className="mt-8">
          {isStreamActive && (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-auto"
            />
          )}
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </div>
  );
}
