"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, Menu, User, Heart } from "lucide-react"

const categories = [
  { name: "Backpacks", slug: "backpacks", count: 12 },
  { name: "Footwear", slug: "footwear", count: 24 },
  { name: "Shelter", slug: "shelter", count: 8 },
  { name: "Equipment", slug: "equipment", count: 16 },
  { name: "Cookware", slug: "cookware", count: 10 },
  { name: "Tools", slug: "tools", count: 14 },
  { name: "Apparel", slug: "apparel", count: 32 },
  { name: "Sleep", slug: "sleep", count: 9 },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-md py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-stone-800">RUPPED</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="hidden md:flex">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-3 p-4 w-[400px]">
                      {categories.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/categories/${category.slug}`}
                          className="flex items-center justify-between p-2 hover:bg-stone-100 rounded-md"
                        >
                          <span>{category.name}</span>
                          <Badge variant="outline">{category.count}</Badge>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className={`${pathname === "/about" ? "font-medium text-amber-600" : ""}`}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className={`${pathname === "/contact" ? "font-medium text-amber-600" : ""}`}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Search */}
            <div className="relative w-64 hidden md:block">
              <Input type="text" placeholder="Search products..." className="pl-9 pr-4 py-2 w-full" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-amber-600">
                3
              </Badge>
            </Button>

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="py-6 space-y-6">
                  <div className="px-4">
                    <Input type="text" placeholder="Search products..." className="w-full" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="px-4 text-lg font-semibold">Categories</h3>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="flex items-center justify-between px-4 py-2 hover:bg-stone-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{category.name}</span>
                        <Badge variant="outline">{category.count}</Badge>
                      </Link>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/about"
                      className="block px-4 py-2 hover:bg-stone-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2 hover:bg-stone-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Contact
                    </Link>
                  </div>

                  <div className="border-t pt-4 space-y-1">
                    <Link
                      href="/account"
                      className="flex items-center px-4 py-2 hover:bg-stone-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Account
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center px-4 py-2 hover:bg-stone-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Wishlist
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center px-4 py-2 hover:bg-stone-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Cart (3)
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

