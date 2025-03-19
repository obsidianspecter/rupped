"use client"

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Star, ChevronRight } from "lucide-react"
import { products } from "@/lib/products"
import NegotiationChat from "@/components/negotiation-chat"
import { motion } from "framer-motion"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import ProductCard from "@/components/product-card"
import { use } from 'react'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const product = products.find((p) => p.id === id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    notFound()
  }

  const productImages = [
    product.image,
    product.additionalImages?.[0] || product.image,
    product.additionalImages?.[1] || product.image,
  ]

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  // Find related products (same category)
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-stone-50"
    >
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-600">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/#products" className="hover:text-amber-600">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href={`/#${product.category}`} className="hover:text-amber-600 capitalize">
              {product.category}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-800 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="p-8 border-r border-gray-100"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-50">
                <Image
                  src={productImages[selectedImage] || "https://placehold.co/800x800/333/FFF?text=Rupped"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement
                    target.src = "https://placehold.co/800x800/333/FFF?text=Rupped"
                  }}
                />
                {product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-amber-600 text-white px-3 py-1">New Arrival</Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`relative aspect-square rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                      selectedImage === index
                        ? "ring-2 ring-amber-600 scale-105 shadow-md"
                        : "ring-1 ring-gray-200 hover:ring-amber-300"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img || "https://placehold.co/400x400/333/FFF?text=Rupped"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        target.src = "https://placehold.co/400x400/333/FFF?text=Rupped"
                      }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8"
            >
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 mr-2 capitalize">
                    {product.category}
                  </Badge>
                  {product.isNew && (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      New Arrival
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= product.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{product.reviewCount} reviews</span>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-4">${product.price.toFixed(2)}</p>
                <p className="text-gray-700 mb-6">{product.description}</p>
              </div>

              <div className="space-y-6 mb-8">
                {/* Quantity Selector */}
                <div>
                  <p className="text-sm font-medium mb-2">Quantity</p>
                  <div className="flex items-center w-32">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-r-none"
                      onClick={decrementQuantity}
                    >
                      -
                    </Button>
                    <div className="h-9 px-3 flex items-center justify-center border-y border-input w-full">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-l-none"
                      onClick={incrementQuantity}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button className="flex-1 bg-stone-800 hover:bg-stone-900">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center text-center p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <Shield className="h-6 w-6 text-amber-600 mb-2" />
                  <span className="text-sm font-medium">Lifetime Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <Truck className="h-6 w-6 text-amber-600 mb-2" />
                  <span className="text-sm font-medium">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <RotateCcw className="h-6 w-6 text-amber-600 mb-2" />
                  <span className="text-sm font-medium">30-Day Returns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
          <Tabs defaultValue="negotiate" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
              <TabsTrigger
                value="negotiate"
                className="data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 rounded-none py-4 px-6"
              >
                Negotiate Price
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 rounded-none py-4 px-6"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 rounded-none py-4 px-6"
              >
                Reviews ({product.reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="negotiate" className="p-6">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 text-center">Negotiate Your Price</h3>
                <p className="text-gray-600 mb-6 text-center">
                  At Rupped, we believe in fair pricing. Use our AI negotiation system to find a price that works for
                  you.
                </p>
                <NegotiationChat productId={product.id} productName={product.name} listPrice={product.price} />
              </div>
            </TabsContent>

            <TabsContent value="details" className="p-6">
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
                    {product.features?.map((feature, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-amber-600 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications?.map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">{spec.name}</span>
                        <span className="font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <Button className="bg-amber-600 hover:bg-amber-700">Write a Review</Button>
                </div>

                <div className="flex items-center mb-8">
                  <div className="mr-4">
                    <div className="text-5xl font-bold text-center">{product.rating.toFixed(1)}</div>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= product.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 text-center mt-1">{product.reviewCount} reviews</div>
                  </div>

                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      // Calculate percentage based on rating (mock data)
                      const percentage =
                        rating === 5 ? 65 : rating === 4 ? 20 : rating === 3 ? 10 : rating === 2 ? 3 : 2
                      return (
                        <div key={rating} className="flex items-center mb-1">
                          <div className="flex items-center mr-2">
                            <span className="text-sm mr-1">{rating}</span>
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">{percentage}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Mock reviews */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b border-gray-100 pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                            <Image
                              src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "women" : "men"}/${20 + i}.jpg`}
                              alt="Reviewer"
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">
                              {i === 1 ? "Sarah Johnson" : i === 2 ? "Michael Chen" : "Emma Wilson"}
                            </p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= (i === 3 ? 4 : 5) ? "text-amber-500 fill-amber-500" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {i === 1 ? "2 weeks ago" : i === 2 ? "1 month ago" : "3 months ago"}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2">
                        {i === 1
                          ? "Excellent quality and durability"
                          : i === 2
                            ? "Great product, worth every penny"
                            : "Good but could be better"}
                      </h4>
                      <p className="text-gray-700">
                        {i === 1
                          ? `I've been using this ${product.name.toLowerCase()} for several hiking trips now and it has exceeded my expectations. The build quality is outstanding and it's clearly built to last.`
                          : i === 2
                            ? `This ${product.name.toLowerCase()} is exactly what I needed for my outdoor adventures. The features are well thought out and the materials are top notch.`
                            : `Overall a good ${product.name.toLowerCase()}, but I wish it had a few more features. Still, it's held up well during my recent camping trip.`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-8">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

