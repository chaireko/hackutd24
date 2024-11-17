'use client'

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [response, setResponse] = useState<string | null>(null);

  const handleBackendCall = async () => {
    try {
      const res = await fetch('/api/hello');
      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      console.error('Error calling backend:', error);
      setResponse('Error occurred while calling the backend');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">hackutd</CardTitle>
          <CardDescription>test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Image
            className="mx-auto dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <Button onClick={handleBackendCall} className="w-full">
            Call Backend
          </Button>
          {response && (
            <p className="text-sm mt-2 p-2 bg-muted rounded">Response: {response}</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
        </CardFooter>
      </Card>
    </div>
  );
}