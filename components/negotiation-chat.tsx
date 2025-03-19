"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, DollarSign, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface NegotiationChatProps {
  productId: string
  productName: string
  listPrice: number
}

export default function NegotiationChat({ productId, productName, listPrice }: NegotiationChatProps) {
  const [offerMode, setOfferMode] = useState(false)
  const [offerAmount, setOfferAmount] = useState(Math.round(listPrice * 0.9))
  const [savings, setSavings] = useState(0)
  const [dealStatus, setDealStatus] = useState<"pending" | "accepted" | "rejected">("pending")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const minOffer = Math.round(listPrice * 0.7)
  const maxOffer = listPrice

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/negotiate",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Welcome to Rupped's AI Negotiation! I see you're interested in the ${productName}. The listed price is $${listPrice.toFixed(2)}. Would you like to make an offer? You can use the slider below or type your offer directly.`,
      },
    ],
    body: {
      productId,
      productName,
      listPrice,
    },
    onFinish: (message) => {
      // Check if the message contains acceptance or rejection keywords
      const lowerContent = message.content.toLowerCase()
      if (lowerContent.includes("accept") || lowerContent.includes("deal") || lowerContent.includes("agreed")) {
        setDealStatus("accepted")
        setSavings(listPrice - offerAmount)
      } else if (
        lowerContent.includes("cannot") ||
        lowerContent.includes("sorry") ||
        lowerContent.includes("too low")
      ) {
        setDealStatus("rejected")
      }
    },
  })

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleOfferSubmit = () => {
    const offerMessage = `I'd like to offer $${offerAmount.toFixed(2)} for this item.`
    append({
      id: Date.now().toString(),
      role: "user",
      content: offerMessage,
    })
    setOfferMode(false)
  }

  return (
    <Card className="w-full border-2 border-amber-600 overflow-hidden shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4">
        <CardTitle className="flex items-center text-lg">
          <DollarSign className="mr-2 h-5 w-5" />
          Rupped AI Negotiation
          <Badge className="ml-auto bg-white/20 text-white">Powered by Llama 3.2</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 bg-gradient-to-b from-stone-50 to-white">
        <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start gap-3 max-w-[80%]">
                    {message.role !== "user" && (
                      <Avatar>
                        <AvatarFallback className="bg-amber-600 text-white">AI</AvatarFallback>
                        <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=rupped" />
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-stone-800 text-white shadow-md"
                          : "bg-stone-100 border border-stone-200 shadow-sm"
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === "user" && (
                      <Avatar>
                        <AvatarFallback className="bg-stone-700 text-white">You</AvatarFallback>
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" />
                      </Avatar>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-amber-600 text-white">AI</AvatarFallback>
                    <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=rupped" />
                  </Avatar>
                  <div className="rounded-lg px-4 py-3 bg-stone-100 border border-stone-200">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                  </div>
                </div>
              </motion.div>
            )}

            {dealStatus === "accepted" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center shadow-md"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-xl text-green-800 mb-2">Deal Accepted!</h3>
                <p className="text-green-700 mb-2">You saved ${savings.toFixed(2)}</p>
                <p className="text-sm text-green-600 mb-4">
                  That's {Math.round((savings / listPrice) * 100)}% off the original price
                </p>
                <Button className="bg-green-600 hover:bg-green-700 shadow-sm">Complete Purchase</Button>
              </motion.div>
            )}

            {dealStatus === "rejected" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center shadow-md"
              >
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsDown className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="font-bold text-xl text-red-700 mb-2">Offer Declined</h3>
                <p className="text-red-600 mb-4">Try a different offer or proceed with list price</p>
                <div className="flex space-x-3 justify-center">
                  <Button variant="outline" onClick={() => setOfferMode(true)}>
                    New Offer
                  </Button>
                  <Button className="bg-stone-800 hover:bg-stone-900">Buy at List Price</Button>
                </div>
              </motion.div>
            )}

            {offerMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 shadow-md"
              >
                <h3 className="font-semibold text-amber-800 text-lg mb-4">Make Your Offer</h3>
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>${minOffer.toFixed(2)}</span>
                    <span>${maxOffer.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[offerAmount]}
                    min={minOffer}
                    max={maxOffer}
                    step={1}
                    onValueChange={(value) => setOfferAmount(value[0])}
                    className="mb-4"
                  />
                  <div className="flex justify-between items-center bg-white p-3 rounded-md border border-amber-200 mb-3">
                    <span className="text-sm font-medium text-gray-600">Your Offer:</span>
                    <span className="font-bold text-2xl text-amber-700">${offerAmount.toFixed(2)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium text-green-600">
                        Save ${(listPrice - offerAmount).toFixed(2)} (
                        {Math.round(((listPrice - offerAmount) / listPrice) * 100)}% off)
                      </span>
                    </div>
                    <Progress value={((listPrice - offerAmount) / listPrice) * 100} className="h-2 mt-1" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1" onClick={() => setOfferMode(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleOfferSubmit}>
                    Submit Offer
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4 bg-stone-50">
        {!offerMode && dealStatus === "pending" && (
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={() => setOfferMode(true)} className="whitespace-nowrap">
              <DollarSign className="h-4 w-4 mr-1" />
              Make Offer
            </Button>
            <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
              <Input
                placeholder="Or type your message here..."
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

