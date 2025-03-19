import { NextResponse } from 'next/server'

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { messages, productId, productName, listPrice } = await req.json()

    // Forward the request to the Python FastAPI backend
    const response = await fetch("http://localhost:8000/api/negotiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        productId,
        productName,
        listPrice,
      }),
    })

    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`FastAPI backend returned ${response.status}: ${await response.text()}`)
    }

    // Return the streaming response with proper headers
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error("Error in negotiation:", error)

    // Fallback to a simple response if the backend is not available
    return NextResponse.json(
      {
        text: "I'm sorry, the negotiation service is currently unavailable. Please try again later.",
      },
      { status: 500 }
    )
  }
}

