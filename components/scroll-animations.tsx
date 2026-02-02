'use client'

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface ParallaxSectionProps {
    children: ReactNode
    className?: string
    offset?: number
}

export function ParallaxSection({ children, className = '', offset = 50 }: ParallaxSectionProps) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    })

    const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
    const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

    return (
        <motion.div ref={ref} style={{ y: smoothY }} className={className}>
            {children}
        </motion.div>
    )
}

interface TextRevealProps {
    text: string
    className?: string
    delay?: number
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    const words = text.split(' ')

    return (
        <div ref={ref} className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    className="inline-block mr-[0.25em]"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    )
}

interface ScrollFadeInProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right'
}

export function ScrollFadeIn({
    children,
    className = '',
    delay = 0,
    direction = 'up'
}: ScrollFadeInProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })

    const directions = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 }
    }

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                y: directions[direction].y,
                x: directions[direction].x,
                filter: 'blur(10px)'
            }}
            animate={isInView ? {
                opacity: 1,
                y: 0,
                x: 0,
                filter: 'blur(0px)'
            } : {}}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface ScaleOnScrollProps {
    children: ReactNode
    className?: string
    scaleRange?: [number, number]
}

export function ScaleOnScroll({
    children,
    className = '',
    scaleRange = [0.8, 1]
}: ScaleOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'center center']
    })

    const scale = useTransform(scrollYProgress, [0, 1], scaleRange)
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])

    return (
        <motion.div
            ref={ref}
            style={{ scale, opacity }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

interface FloatingOrbProps {
    className?: string
    color?: string
    size?: number
    delay?: number
}

export function FloatingOrb({
    className = '',
    color = '#8B5CF6',
    size = 400,
    delay = 0
}: FloatingOrbProps) {
    return (
        <motion.div
            className={`absolute rounded-full blur-[100px] ${className}`}
            style={{
                width: size,
                height: size,
                background: `radial-gradient(circle, ${color}40 0%, ${color}10 50%, transparent 70%)`
            }}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
                x: [0, 30, 0],
                y: [0, -20, 0]
            }}
            transition={{
                duration: 8,
                delay,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        />
    )
}

interface GlowButtonProps {
    children: ReactNode
    className?: string
    onClick?: () => void
    href?: string
}

export function GlowButton({ children, className = '', onClick }: GlowButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative group ${className}`}
        >
            {/* Glow effect */}
            <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 opacity-70 blur-lg group-hover:opacity-100 transition-opacity"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                style={{ backgroundSize: '200% 200%' }}
            />
            {/* Button content */}
            <div className="relative px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium flex items-center gap-2">
                {children}
            </div>
        </motion.button>
    )
}

interface AnimatedCounterProps {
    value: number
    suffix?: string
    className?: string
}

export function AnimatedCounter({ value, suffix = '', className = '' }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true })

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
            >
                {value.toLocaleString()}{suffix}
            </motion.span>
        </motion.span>
    )
}

interface MagneticProps {
    children: ReactNode
    className?: string
}

export function Magnetic({ children, className = '' }: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current!.getBoundingClientRect()
        const x = (clientX - left - width / 2) * 0.2
        const y = (clientY - top - height / 2) * 0.2
        ref.current!.style.transform = `translate(${x}px, ${y}px)`
    }

    const handleMouseLeave = () => {
        ref.current!.style.transform = 'translate(0, 0)'
    }

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transition-transform duration-200 ${className}`}
        >
            {children}
        </div>
    )
}
