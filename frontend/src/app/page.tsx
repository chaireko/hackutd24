'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import dynamic from 'next/dynamic';
import Mascot from "@/components/Mascot";
import Image from "next/image";

const ThreeScene = dynamic(() => import('../components/Mascot'), { ssr: false });

export default function Page() {
  return (
    <div 
      className="min-h-screen text-white font-inter relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #6893FF 0%, #72FFD2 100%)'
      }}
      >
        <Image src="/ripple-animation.gif" alt="Background Overlay" width={400} height={400} className="absolute -top-20 -left-20 z-0" />
        <Image src="/ripple-animation.gif" alt="Background Overlay" width={400} height={400} className="absolute -bottom-20 -right-20 z-0" />
      <div className="absolute inset-0 bg-cover bg-center">
        <img    
          src="ripple.png"
          alt="Background Overlay"
          className="absolute inset-0 object-cover w-full h-full opacity-30"
          />
      </div> 
      <img 
        src="landing_bottom_left.png"
        alt="border"
        className="absolute bottom-0 left-0 p-4 w-64 h-auto"
        />
      <img 
        src="landing_top_right.png"
        alt="border"
        className="absolute top-0 right-0 p-4 w-64 h-auto"
        />
      <main className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full h-48 mb-8 flex justify-center">
          <svg viewBox="0 0 1000 100" className="w-full h-full">
            <path
              id="curve"
              d="M0,100 Q500,20 1000,100"
              fill="transparent"
              />
            <text className="fill-current text-8xl font-extrabold drop-shadow-lg z-[9999]">
              <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle" className="z-[9999]">
                ECHO
              </textPath>
            </text>
          </svg>
        </div>

        <div className="absolute -top-3 z-[9999]">
          <Mascot />
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Link href="/webcam">
            <Button variant="outline" className="bg-white text-[#688BFF] hover:bg-blue-100 hover:text-[#688BFF] font-extrabold drop-shadow">
              play
            </Button>
          </Link>
          <Link href="/quiz">
            <Button variant="outline" className="bg-white mx-4 text-[#688BFF] hover:bg-blue-100 hover:text-[#688BFF] font-extrabold drop-shadow">
              quiz
            </Button>
          </Link>
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
      </main>
    </div>
  )
}