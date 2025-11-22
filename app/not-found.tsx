'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Flag, Home, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-5 dark:opacity-[0.02]" />

      <div className="max-w-lg w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-red-500/20">
            <Flag className="w-16 h-16 text-red-500" />
          </div>

          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-2 font-heading">
            404
          </h1>

          <h2 className="text-3xl font-bold text-foreground mb-4">
            Out of Bounds!
          </h2>

          <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
            Penalty on the play. The page you are looking for has been moved, deleted, or never existed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2">
              <Link href="/courses">
                <BookOpen className="w-4 h-4 mr-2" />
                View Playbook
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
