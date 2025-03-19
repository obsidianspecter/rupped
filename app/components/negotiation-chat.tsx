import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Message {
  role: 'assistant' | 'user'
  content: string
}

interface NegotiationChatProps {
  productId: string
  productName: string
  listPrice: number
}

export function NegotiationChat({ productId, productName, listPrice }: NegotiationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your AI sales assistant. I see you're interested in the ${productName}. The list price is $${listPrice}. Would you like to make an offer?`
    }
  ])
  const [offerMode, setOfferMode] = useState(false)
  const [offerAmount, setOfferAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dealStatus, setDealStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmitOffer = async () => {
    if (!offerAmount || isLoading) return

    const userMessage = `I'd like to offer $${offerAmount} for the ${productName}.`
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)
    setOfferMode(false)
    setOfferAmount('')

    try {
      const response = await fetch('/api/negotiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          productId,
          productName,
          listPrice,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      // Use EventSource for proper SSE handling
      const reader = response.body?.getReader()
      if (!reader) return

      let currentMessage = ''
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Convert the chunk to text and process it
        const text = new TextDecoder().decode(value)
        buffer += text

        // Process complete SSE messages
        const messages = buffer.split('\n\n')
        buffer = messages.pop() || '' // Keep the last incomplete chunk in the buffer

        for (const message of messages) {
          // Extract the actual content from the SSE data field
          const match = message.match(/^data:\s*(.+)$/m)
          if (match) {
            const content = match[1].trim()
            if (content && content !== currentMessage) {
              currentMessage = content
              
              // Update messages state with the clean content
              setMessages(prev => {
                const newMessages = [...prev]
                if (newMessages[newMessages.length - 1]?.role === 'assistant') {
                  newMessages[newMessages.length - 1].content = currentMessage
                } else {
                  newMessages.push({ role: 'assistant', content: currentMessage })
                }
                return newMessages
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        {offerMode ? (
          <>
            <Input
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="Enter your offer amount"
              className="flex-1"
            />
            <Button onClick={handleSubmitOffer} disabled={isLoading}>
              Submit Offer
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setOfferMode(true)}
            className="w-full"
            disabled={isLoading || dealStatus !== 'pending'}
          >
            Make an Offer
          </Button>
        )}
      </div>
    </Card>
  )
} 