'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StaggerRevealProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
    y?: number
    duration?: number
}

export function StaggerReveal({
    children,
    className = '',
    staggerDelay = 0.1,
    y = 30,
    duration = 0.6
}: StaggerRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const items = containerRef.current?.children
            if (!items) return

            gsap.fromTo(
                items,
                {
                    opacity: 0,
                    y
                },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    stagger: staggerDelay,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 85%',
                        once: true
                    }
                }
            )
        }, containerRef)

        return () => ctx.revert()
    }, [staggerDelay, y, duration])

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    )
}

interface FadeInProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right'
}

export function FadeIn({
    children,
    className = '',
    delay = 0,
    direction = 'up'
}: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const directions = {
                up: { y: 30, x: 0 },
                down: { y: -30, x: 0 },
                left: { y: 0, x: 30 },
                right: { y: 0, x: -30 }
            }

            gsap.fromTo(
                ref.current,
                {
                    opacity: 0,
                    ...directions[direction]
                },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    duration: 0.6,
                    delay,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 90%',
                        once: true
                    }
                }
            )
        }, ref)

        return () => ctx.revert()
    }, [delay, direction])

    return (
        <div ref={ref} className={className} style={{ opacity: 0 }}>
            {children}
        </div>
    )
}

interface ScaleInProps {
    children: ReactNode
    className?: string
    delay?: number
}

export function ScaleIn({ children, className = '', delay = 0 }: ScaleInProps) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ref.current,
                {
                    opacity: 0,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    delay,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: ref.current,
                        start: 'top 90%',
                        once: true
                    }
                }
            )
        }, ref)

        return () => ctx.revert()
    }, [delay])

    return (
        <div ref={ref} className={className} style={{ opacity: 0 }}>
            {children}
        </div>
    )
}
