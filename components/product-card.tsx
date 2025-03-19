"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full flex flex-col border-0 shadow-md group">
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.src = "https://placehold.co/400x400/333/FFF?text=Rupped"
            }}
          />
          {product.isNew && <Badge className="absolute top-2 right-2 bg-amber-600">New</Badge>}

          {/* Quick action buttons */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-black/70 p-2 flex justify-between transition-transform duration-300 ${isHovered ? "translate-y-0" : "translate-y-full"}`}
          >
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20 h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 h-8 px-3">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        <CardContent className="p-5 flex-grow">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs text-stone-600 capitalize">
              {product.category}
            </Badge>
          </div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
            <span className="font-bold text-amber-600">${product.price.toFixed(2)}</span>
          </div>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= product.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
        </CardContent>
        <CardFooter className="p-5 pt-0">
          <Button asChild className="w-full bg-stone-800 hover:bg-stone-900">
            <Link href={`/products/${product.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

