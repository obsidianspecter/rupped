"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Settings, Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react"

export default function Footer() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "2122") {
      // Store the current path to indicate authorized access
      sessionStorage.setItem("lastPath", "/")
      router.push("/setup")
    } else {
      setError("Incorrect password")
    }
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this to your backend
    alert(`Thank you for subscribing with ${email}!`)
    setEmail("")
  }

  return (
    <footer className="bg-stone-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-amber-600 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
              <p className="text-white/90">Get exclusive deals, outdoor tips, and new product announcements.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="w-full md:w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="ml-2 bg-white text-amber-600 hover:bg-white/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-bold">RUPPED</span>
            </Link>
            <p className="text-gray-400 mb-6">Premium outdoor gear with AI-powered price negotiation.</p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Adventure Way, Boulder, CO 80302</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-amber-600 mr-2" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-amber-600 mr-2" />
                <span className="text-gray-400">info@rupped.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-800 pb-2">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#products" className="text-gray-400 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/backpacks" className="text-gray-400 hover:text-white transition-colors">
                  Backpacks
                </Link>
              </li>
              <li>
                <Link href="/categories/shelter" className="text-gray-400 hover:text-white transition-colors">
                  Tents
                </Link>
              </li>
              <li>
                <Link href="/categories/footwear" className="text-gray-400 hover:text-white transition-colors">
                  Footwear
                </Link>
              </li>
              <li>
                <Link href="/categories/equipment" className="text-gray-400 hover:text-white transition-colors">
                  Equipment
                </Link>
              </li>
              <li>
                <Link href="/categories/apparel" className="text-gray-400 hover:text-white transition-colors">
                  Apparel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-800 pb-2">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#sustainability" className="text-gray-400 hover:text-white transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 border-b border-gray-800 pb-2">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-400 hover:text-white transition-colors">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Rupped. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>

            {/* Admin Setup Link (Password Protected) */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-gray-500 hover:text-gray-300 flex items-center opacity-50 transition-colors">
                  <Settings className="h-3 w-3 mr-1" />
                  <span className="text-xs">Admin</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Admin Access</DialogTitle>
                  <DialogDescription>Enter password to access the AI backend setup.</DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const form = e.target as HTMLFormElement
                    const passwordInput = form.elements.namedItem("password") as HTMLInputElement
                    const password = passwordInput.value

                    if (password === "2122") {
                      // Store the current path to indicate authorized access
                      sessionStorage.setItem("lastPath", "/")
                      // Close dialog by simulating a click on the close button
                      const closeButton = document.querySelector('[data-dialog-close="true"]') as HTMLButtonElement
                      if (closeButton) closeButton.click()
                      // Navigate after a short delay to ensure dialog is closed
                      setTimeout(() => router.push("/setup"), 100)
                    } else {
                      setError("Incorrect password")
                    }
                  }}
                >
                  <div className="space-y-4 py-4">
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setError("")
                      }}
                      className="w-full"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">Access Setup</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </footer>
  )
}

