"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"

interface BorderBeamProps {
    className?: string
    size?: number
    duration?: number
    delay?: number
    colorFrom?: string
    colorTo?: string
}

export function BorderBeam({
    className,
    size = 200,
    duration = 12,
    delay = 0,
    colorFrom = "#ffaa40",
    colorTo = "#9c40ff",
}: BorderBeamProps) {
    const beamRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!beamRef.current) return

        const ctx = gsap.context(() => {
            gsap.to(beamRef.current, {
                "--beam-offset": "100%",
                duration,
                delay,
                ease: "none",
                repeat: -1,
            })
        })

        return () => ctx.revert()
    }, [duration, delay])

    return (
        <div
            ref={beamRef}
            style={{
                "--size": `${size}px`,
                "--color-from": colorFrom,
                "--color-to": colorTo,
                "--beam-offset": "0%",
            } as React.CSSProperties}
            className={`pointer-events-none absolute inset-0 rounded-[inherit] [border:1px_solid_transparent] ![background-clip:padding-box,border-box] ![background-origin:padding-box,border-box] [background:linear-gradient(to_right,transparent,transparent),linear-gradient(calc(var(--beam-offset)*3.6deg),var(--color-from),var(--color-to),transparent,transparent,transparent)] ${className}`}
        />
    )
}
