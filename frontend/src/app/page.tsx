import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div 
    className="min-h-screen text-white font-inter"
    style={{
      background: 'linear-gradient(180deg, #6893FF 0%, #72FFD2 100%)'
    }}
  >
    <div
    className="absolute inset-0 bg-cover bg-center"
    >
      <img    
      src="ripple.png"
      alt="Background Overlay"
      className="absolute inset-0 object-cover w-full h-full opacity-30"/>
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
          <Button variant="outline" className="bg-white text-[#688BFF] hover:bg-blue-100 hover:text-[#688BFF] font-extrabold drop-shadow">
            play
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
      </main>
    </div>
  )
}