"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Shield, Truck, RotateCcw, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Founded by outdoor enthusiasts, Rupped was born from a simple idea: create premium gear that lasts a lifetime,
          with pricing that's fair and transparent.
        </p>
      </motion.div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-[400px] rounded-lg overflow-hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=800&auto=format&fit=crop"
            alt="Rupped team in the mountains"
            fill
            className="object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-6">
            At Rupped, we believe that outdoor gear should be built to last, not to be replaced. We're committed to
            creating products that withstand the harshest conditions while maintaining fair and transparent pricing.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our innovative AI negotiation system allows customers to find a price that works for them, eliminating the
            traditional retail markup and creating a more direct relationship between maker and adventurer.
          </p>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
              <Image
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Founder"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold">Michael Rupp</p>
              <p className="text-amber-600">Founder & CEO</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Values Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-stone-50 p-8 rounded-lg border border-stone-100">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Quality First</h3>
            <p className="text-gray-600">
              We never compromise on materials or construction. Every product is built to withstand years of adventure.
            </p>
          </div>
          <div className="bg-stone-50 p-8 rounded-lg border border-stone-100">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sustainability</h3>
            <p className="text-gray-600">
              We're committed to reducing our environmental footprint through sustainable materials and manufacturing
              processes.
            </p>
          </div>
          <div className="bg-stone-50 p-8 rounded-lg border border-stone-100">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Fair Pricing</h3>
            <p className="text-gray-600">
              Our AI negotiation system ensures everyone gets a fair deal, eliminating unnecessary markups and
              middlemen.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mb-20"
      >
        <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Michael Rupp", role: "Founder & CEO", image: "https://randomuser.me/api/portraits/men/32.jpg" },
            {
              name: "Sarah Johnson",
              role: "Head of Design",
              image: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            { name: "David Chen", role: "Lead Engineer", image: "https://randomuser.me/api/portraits/men/68.jpg" },
            {
              name: "Emma Wilson",
              role: "Sustainability Director",
              image: "https://randomuser.me/api/portraits/women/65.jpg",
            },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-amber-600">{member.role}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Commitment Section */}
      <div className="bg-stone-800 text-white rounded-xl p-12 mb-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Commitment</h2>
          <p className="text-xl mb-8">
            Every Rupped product comes with our lifetime guarantee. If it breaks, we'll repair or replace it. No
            questions asked.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="font-bold mb-2">Lifetime Warranty</h3>
              <p className="text-gray-300 text-sm">If it breaks, we fix it. Forever.</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-300 text-sm">On all orders over $50.</p>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="font-bold mb-2">30-Day Returns</h3>
              <p className="text-gray-300 text-sm">Not satisfied? Send it back.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

