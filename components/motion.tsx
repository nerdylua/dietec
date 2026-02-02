'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedCardProps {
    children: ReactNode
    className?: string
    delay?: number
}

export function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
                y: -4,
                transition: { duration: 0.2 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface AnimatedButtonProps {
    children: ReactNode
    className?: string
    onClick?: () => void
    type?: 'button' | 'submit'
    disabled?: boolean
}

export function AnimatedButton({
    children,
    className = '',
    onClick,
    type = 'button',
    disabled = false
}: AnimatedButtonProps) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={className}
        >
            {children}
        </motion.button>
    )
}

interface AnimatedLinkProps {
    children: ReactNode
    className?: string
    href: string
}

export function AnimatedLink({ children, className = '', href }: AnimatedLinkProps) {
    return (
        <motion.a
            href={href}
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={className}
        >
            {children}
        </motion.a>
    )
}

interface GlowingGradientProps {
    className?: string
    colors?: string[]
}

export function GlowingGradient({
    className = '',
    colors = ['#3B82F6', '#8B5CF6', '#EC4899']
}: GlowingGradientProps) {
    return (
        <motion.div
            className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
            animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
            style={{
                background: `radial-gradient(circle, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`
            }}
        />
    )
}

interface FloatingIconProps {
    children: ReactNode
    className?: string
    delay?: number
}

export function FloatingIcon({ children, className = '', delay = 0 }: FloatingIconProps) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -8, 0],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                delay,
                ease: 'easeInOut'
            }}
        >
            {children}
        </motion.div>
    )
}

interface CountUpProps {
    value: number
    className?: string
    prefix?: string
    suffix?: string
}

export function CountUp({ value, className = '', prefix = '', suffix = '' }: CountUpProps) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {prefix}{value.toLocaleString()}{suffix}
            </motion.span>
        </motion.span>
    )
}
