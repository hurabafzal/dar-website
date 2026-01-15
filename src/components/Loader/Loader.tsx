"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative">
        {/* Logo Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/assets/dar-logo.png"
            alt="DAR Logo"
            width={180}
            height={60}
            className="relative z-10"
            style={{ objectFit: 'contain' }}
          />
        </motion.div>
        
        {/* Animated Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#007D8A] filter blur-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        
        {/* Pulsing Circles */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute inset-0 rounded-full border-2 border-[#007D8A]"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.5, 2],
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
              repeat: Infinity,
              delay: index * 0.6,
            }}
          />
        ))}
      </div>
    </div>
  )
}

