export async function POST(req: any) {
  async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Array<any> = [];
  for await (let chunk of stream) {
      chunks.push(chunk)
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString("utf-8")
}

  

    try {
      const API_KEY = process.env.API_KEY; // Make sure to set the API_KEY in your .env
      console.log(API_KEY)
  
      // Get the request body if you need dynamic content
      const body = await req.json();
      console.log(body)

      const affirmationPrompts = [
        'Give me a postive affirmation. Mention that I am strong.',
        'Give me a postive affirmation. Mention that I am compassionate.',
        'Give me a postive affirmation. Mention that I am resourceful.',
        'Give me a postive affirmation. Mention that I am kind.',
        'Give me a postive affirmation. Mention that I am amazing.',
        'Give me a postive affirmation. Mention that I am cool.',
        'Give me a postive affirmation. Mention that I am helpful.',
      ]
  
      // Define the payload
      const payload = {
        stream: true,
        model: "Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant",
          },
          {
            role: "user",
            content: `${affirmationPrompts[Math.floor(Math.random()*affirmationPrompts.length)]} Keep it to one sentence.`,
          },
        ],
      };
  
      // Fetch request to the external API
      const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      // Check if the response is ok (status code 200)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      // const streamStr = await streamToString(response.body!);
      // console.log(streamStr);
      return new Response(response.body, { status: 200 });
    } catch (error: any) {
      console.log(error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  