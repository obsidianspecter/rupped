from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import httpx
import json
import os
import logging
import asyncio
from sse_starlette.sse import EventSourceResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Rupped AI Negotiation Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ollama API endpoint
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api")
LLAMA_MODEL = os.getenv("LLAMA_MODEL", "llama3.2")  # Specifically using Llama 3.2

class Message(BaseModel):
    role: str
    content: str

class NegotiationRequest(BaseModel):
    messages: List[Message]
    productId: str
    productName: str
    listPrice: float

class StreamResponse(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Rupped AI Negotiation API is running. Go to /docs for documentation."}

@app.get("/health")
async def health_check():
    # Check if Ollama is available
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_API_URL}/tags", timeout=2.0)
            if response.status_code == 200:
                models = response.json().get("models", [])
                llama_available = any(LLAMA_MODEL.split(":")[0] in model.get("name", "") for model in models)
                if llama_available:
                    return {"status": "healthy", "ollama": "connected", "llama3": "available"}
                else:
                    return {"status": "degraded", "ollama": "connected", "llama3": "not found", 
                            "message": f"Llama 3 model not found. Run 'ollama pull {LLAMA_MODEL}'"}
            return {"status": "degraded", "ollama": "connected", "error": "Failed to list models"}
    except Exception as e:
        logger.warning(f"Ollama health check failed: {str(e)}")
        return {"status": "degraded", "ollama": "disconnected", 
                "message": "Ollama not available. Make sure Ollama is running with 'ollama serve'"}
    
    return {"status": "healthy"}

async def stream_ollama_response(request: NegotiationRequest):
    """Stream response from Ollama"""
    try:
        # Create system prompt
        system_prompt = f"""
        You are a friendly AI negotiation assistant for Rupped, a premium outdoor gear company.

        Product: {request.productName}
        List Price: ${request.listPrice}

        Your goal is to negotiate with the customer but also maximize profit. You should:
        1. Be friendly and professional with a rugged, outdoorsy personality
        2. Consider reasonable offers (no more than 20% discount)
        3. Explain why you can or cannot accept an offer
        4. Emphasize the quality, durability, and lifetime warranty of Rupped products
        5. If the customer makes a reasonable offer, accept it and provide next steps
        6. If the offer is too low, make a reasonable counter-offer

        Keep responses concise and focused on the negotiation.
        Respond in 2-3 complete sentences maximum.
        Do not use partial sentences or fragments.
        """
        
        # Format messages for Ollama
        formatted_messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # Add conversation history (limited to last 10 messages for context)
        conversation_history = request.messages[-10:]
        for msg in conversation_history:
            formatted_messages.append({"role": msg.role, "content": msg.content})
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_API_URL}/chat",
                json={
                    "model": LLAMA_MODEL,
                    "messages": formatted_messages,
                    "stream": True,
                    "temperature": 0.7,
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"Ollama API error: {response.text}")
                yield "data: Error communicating with LLM\n\n"
                return
            
            # Stream the response with improved sentence handling
            current_sentence = ""
            complete_response = ""
            
            async for line in response.aiter_lines():
                if not line:
                    continue
                    
                try:
                    data = json.loads(line)
                    if "message" in data and "content" in data["message"]:
                        chunk = data["message"]["content"]
                        current_sentence += chunk
                        
                        # Check for sentence endings
                        if any(current_sentence.rstrip().endswith(char) for char in ['.', '!', '?']):
                            # Clean up the sentence
                            clean_sentence = current_sentence.strip()
                            if clean_sentence:
                                complete_response = clean_sentence
                                # Send a single SSE message with the complete sentence
                                yield f"data: {complete_response}\n\n"
                                current_sentence = ""
                            
                except json.JSONDecodeError:
                    logger.error(f"Failed to parse JSON: {line}")
                    continue
            
            # Send any remaining text as a final message
            if current_sentence.strip():
                complete_response = current_sentence.strip()
                yield f"data: {complete_response}\n\n"
                    
    except Exception as e:
        logger.exception(f"Error streaming from Ollama: {str(e)}")
        yield f"data: Error: {str(e)}\n\n"

@app.post("/api/negotiate")
async def negotiate(request: NegotiationRequest):
    """Handle negotiation requests with streaming response"""
    return EventSourceResponse(stream_ollama_response(request))

@app.post("/api/negotiate/non-streaming")
async def negotiate_non_streaming(request: NegotiationRequest):
    """Non-streaming version for compatibility"""
    try:
        # Get the last user message
        user_messages = [msg for msg in request.messages if msg.role == "user"]
        if not user_messages:
            return StreamResponse(text="Hello! I'm the Rupped negotiation assistant. How can I help you today?")
        
        last_user_message = user_messages[-1].content
        
        # Create system prompt
        system_prompt = f"""
        You are a friendly AI negotiation assistant for Rupped, a premium outdoor gear company.

        Product: {request.productName}
        List Price: ${request.listPrice}

        Your goal is to negotiate with the customer but also maximize profit. You should:
        1. Be friendly and professional with a rugged, outdoorsy personality
        2. Consider reasonable offers (no more than 20% discount)
        3. Explain why you can or cannot accept an offer
        4. Emphasize the quality, durability, and lifetime warranty of Rupped products
        5. If the customer makes a reasonable offer, accept it and provide next steps
        6. If the offer is too low, make a reasonable counter-offer

        Keep responses concise and focused on the negotiation.
        """
        
        # Format messages for Ollama
        formatted_messages = [
            {"role": "system", "content": system_prompt}
        ]
        
        # Add conversation history
        conversation_history = request.messages[-10:]
        for msg in conversation_history:
            formatted_messages.append({"role": msg.role, "content": msg.content})
        
        # Call Ollama API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_API_URL}/chat",
                json={
                    "model": LLAMA_MODEL,
                    "messages": formatted_messages,
                    "stream": False,
                    "temperature": 0.7,
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                logger.error(f"Ollama API error: {response.text}")
                raise HTTPException(status_code=500, detail="Error communicating with LLM")
            
            result = response.json()
            ai_response = result.get("message", {}).get("content", "")
            
            return StreamResponse(text=ai_response)
            
    except Exception as e:
        logger.exception(f"Error in negotiation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process negotiation: {str(e)}")

@app.get("/api/models")
async def list_models():
    """List available models from Ollama"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{OLLAMA_API_URL}/tags", timeout=5.0)
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Error communicating with Ollama")
            
            return response.json()
    except Exception as e:
        logger.exception(f"Error listing models: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to list models: {str(e)}")

@app.post("/api/pull-model")
async def pull_model(model_name: str = LLAMA_MODEL):
    """Pull a model from Ollama"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_API_URL}/pull",
                json={"name": model_name},
                timeout=60.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Error pulling model from Ollama")
            
            return {"status": "success", "message": f"Started pulling model {model_name}"}
    except Exception as e:
        logger.exception(f"Error pulling model: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to pull model: {str(e)}")

# Add a mock endpoint for testing without Ollama
@app.post("/api/negotiate/mock")
async def mock_negotiate(request: NegotiationRequest):
    """Mock endpoint for testing without Ollama"""
    # Simulate processing time
    await asyncio.sleep(1)
    
    # Extract offer amount if present
    last_user_message = ""
    for msg in reversed(request.messages):
        if msg.role == "user":
            last_user_message = msg.content
            break
    
    # Check if message contains an offer
    import re
    offer_match = re.search(r'\$?(\d+(\.\d+)?)', last_user_message)
    
    if offer_match:
        offer_amount = float(offer_match.group(1))
        list_price = request.listPrice
        
        # Calculate discount percentage
        discount = (list_price - offer_amount) / list_price * 100
        
        if discount <= 15:
            return StreamResponse(text=f"That's a fair offer! I can accept ${offer_amount:.2f} for the {request.productName}. Would you like to proceed with the purchase?")
        elif discount <= 25:
            counter = list_price * 0.85
            return StreamResponse(text=f"I appreciate your offer of ${offer_amount:.2f}, but that's a bit low for our premium {request.productName}. I can go as low as ${counter:.2f}, which is 15% off the list price. Our gear is built to last a lifetime, and we stand behind it with our warranty.")
        else:
            counter = list_price * 0.8
            return StreamResponse(text=f"I understand you're looking for a good deal, but ${offer_amount:.2f} is too low for the {request.productName}. The quality and durability of our gear justifies the price. The best I can do is ${counter:.2f}, which is already a significant 20% discount.")
    else:
        return StreamResponse(text=f"Thanks for your interest in the {request.productName}! The list price is ${request.listPrice:.2f}, but I'm authorized to offer some flexibility. Would you like to make an offer?")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)

