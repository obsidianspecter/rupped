"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/products"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useRef } from "react"

export default function Home() {
  const productsRef = useRef<HTMLElement>(null)

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1600&auto=format&fit=crop"
            alt="Rugged mountain landscape"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="container relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">RUPPED</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
              Gear that endures. Prices you negotiate.
            </p>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={scrollToProducts}>
              Explore Gear
            </Button>
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          onClick={scrollToProducts}
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-stone-100">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Gear That Lasts. <br />
                Prices You Control.
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                At Rupped, we believe in fair pricing and exceptional quality. That's why we've pioneered AI-powered
                price negotiation - allowing you to haggle directly with our system to find a price that works for both
                of us.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Every piece of gear is built to withstand the harshest conditions, backed by our lifetime guarantee.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700">Our Story</Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop"
                alt="Rugged outdoor gear"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" ref={productsRef} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Gear</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of rugged outdoor equipment designed to withstand the elements.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-stone-800 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-12">What Our Customers Say</h2>
            <blockquote className="text-2xl italic mb-8">
              "The negotiation feature is brilliant! I saved 15% on my backpack and the quality is outstanding. Rupped
              has changed how I shop for outdoor gear."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Customer"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-semibold">Alex Morgan</p>
                <p className="text-amber-400">Avid Hiker</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

