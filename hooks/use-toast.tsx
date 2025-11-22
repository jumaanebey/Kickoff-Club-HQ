'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/shared/utils'

type ToastType = 'default' | 'success' | 'error' | 'info'

interface Toast {
    id: string
    title: string
    description?: string
    variant?: 'default' | 'destructive'
    type?: ToastType
}

interface ToastContextType {
    toast: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = ({ title, description, variant = 'default', type }: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7)
        const newToast: Toast = { id, title, description, variant, type }

        setToasts((prev) => [...prev, newToast])

        // Auto remove after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 5000)
    }

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    const getIcon = (variant?: string, type?: ToastType) => {
        if (variant === 'destructive') return <AlertCircle className="h-5 w-5" />
        if (type === 'success') return <CheckCircle2 className="h-5 w-5" />
        if (type === 'error') return <AlertCircle className="h-5 w-5" />
        return <Info className="h-5 w-5" />
    }

    const getStyles = (variant?: string) => {
        if (variant === 'destructive') {
            return 'bg-red-500/90 text-white border-red-600'
        }
        return 'bg-gray-900/90 dark:bg-gray-100/90 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200'
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 pointer-events-none max-w-md w-full">
                <AnimatePresence mode="popLayout">
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 50, scale: 0.3 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            className={cn(
                                'pointer-events-auto rounded-lg border-2 p-4 shadow-lg backdrop-blur-md',
                                getStyles(t.variant)
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {getIcon(t.variant, t.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm">{t.title}</p>
                                    {t.description && (
                                        <p className="text-sm opacity-90 mt-1">{t.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeToast(t.id)}
                                    className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                                    aria-label="Close"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
