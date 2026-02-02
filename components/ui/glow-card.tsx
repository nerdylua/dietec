"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlowCardProps {
    children: React.ReactNode
    className?: string
    glowColor?: string
}

export function GlowCard({ children, className, glowColor = "rgba(255,255,255,0.05)" }: GlowCardProps) {
    return (
        <motion.div
            className={cn(
                "relative rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden group",
                className
            )}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            {/* Glow effect on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${glowColor}, transparent 40%)`,
                }}
            />
            <div className="relative z-10">{children}</div>
        </motion.div>
    )
}
