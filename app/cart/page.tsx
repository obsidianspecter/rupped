"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { products } from "@/lib/products"

// Mock cart items
const initialCartItems = [
  { id: "1", quantity: 1 },
  { id: "4", quantity: 1 },
  { id: "6", quantity: 1 },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  // Get product details for cart items
  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.id)
      return {
        ...product,
        quantity: item.quantity,
      }
    })
    .filter(Boolean)

  // Calculate totals
  const subtotal = cartProducts.reduce((sum, item) => sum + (item?.price || 0) * (item?.quantity || 0), 0)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "rupped10") {
      setPromoApplied(true)
    } else {
      alert("Invalid promo code")
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto"
        >
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/#products">Start Shopping</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
                <CardDescription>Review and modify your selected items</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartProducts.map((item) => (
                      <TableRow key={item?.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-16 h-16 relative rounded overflow-hidden mr-3">
                              <Image
                                src={item?.image || "/placeholder.svg"}
                                alt={item?.name || "Product"}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "https://placehold.co/400x400/333/FFF?text=Rupped"
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item?.name}</h3>
                              <p className="text-sm text-gray-500 capitalize">{item?.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${item?.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() => updateQuantity(item?.id || "", (item?.quantity || 0) - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="h-8 px-3 flex items-center justify-center border-y border-input w-10">
                              {item?.quantity}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() => updateQuantity(item?.id || "", (item?.quantity || 0) + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item?.id || "")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/#products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" onClick={() => setCartItems([])}>
                  Clear Cart
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="pt-4">
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                    />
                    <Button variant="outline" onClick={applyPromoCode} disabled={promoApplied || !promoCode}>
                      Apply
                    </Button>
                  </div>

                  {promoApplied && (
                    <div className="bg-green-50 text-green-700 p-2 rounded text-sm mb-4">
                      Promo code RUPPED10 applied successfully!
                    </div>
                  )}

                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>

                  <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    <span>Secure checkout</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

