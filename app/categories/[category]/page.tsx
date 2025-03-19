"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { products } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Filter, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import type { Product } from "@/lib/types"

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sortOption, setSortOption] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Format category name for display
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  useEffect(() => {
    // Filter products by category
    let filtered = products.filter((product) => product.category.toLowerCase() === category.toLowerCase())

    // If no products found, show all products
    if (filtered.length === 0) {
      filtered = products
    }

    // Apply price filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered = filtered.filter((product) => product.isNew).concat(filtered.filter((product) => !product.isNew))
        break
      default:
        // Featured - no specific sorting
        break
    }

    setFilteredProducts(filtered)
  }, [category, sortOption, priceRange])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-amber-600">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/#products" className="hover:text-amber-600">
          Products
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-800 font-medium capitalize">{categoryName}</span>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{categoryName}</h1>
          <p className="text-gray-500">{filteredProducts.length} products</p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down products to find exactly what you're looking for.</SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 500]}
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Product Type</h3>
                  <div className="space-y-2">
                    {["Backpacks", "Footwear", "Shelter", "Equipment", "Cookware"].map((type) => (
                      <div key={type} className="flex items-center">
                        <Checkbox id={`type-${type}`} />
                        <Label htmlFor={`type-${type}`} className="ml-2">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Brand</h3>
                  <div className="space-y-2">
                    {["Rupped", "OutdoorPro", "WildernessGear", "TrekMaster"].map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox id={`brand-${brand}`} />
                        <Label htmlFor={`brand-${brand}`} className="ml-2">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Filters */}
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              All Filters
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Price:</span>
              <Select
                value={`${priceRange[0]}-${priceRange[1]}`}
                onValueChange={(value) => {
                  const [min, max] = value.split("-").map(Number)
                  setPriceRange([min, max])
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500">All Prices</SelectItem>
                  <SelectItem value="0-100">Under $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200-300">$200 - $300</SelectItem>
                  <SelectItem value="300-500">Over $300</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sorting */}
          <div className="w-full sm:w-auto">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or browse our other categories.</p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/#products">View All Products</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

