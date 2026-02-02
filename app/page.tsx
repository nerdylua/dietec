'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import {
  ScrollFadeIn,
  FloatingOrb,
  Magnetic,
  TextReveal
} from '@/components/scroll-animations'
import {
  Calendar,
  FlaskConical,
  Pill,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Heart,
  Activity,
  Users,
  Clock,
  Shield,
  Stethoscope,
  Brain,
  Mic,
  FileText
} from 'lucide-react'

const features = [
  {
    icon: Calendar,
    label: 'Smart Appointments',
    desc: 'AI-powered scheduling that finds the perfect time with top specialists.',
    gradient: 'from-blue-500 to-cyan-400',
    accent: '#3B82F6'
  },
  {
    icon: FlaskConical,
    label: 'Lab Tests',
    desc: 'Book tests with home collection. Results delivered digitally.',
    gradient: 'from-violet-500 to-purple-400',
    accent: '#8B5CF6'
  },
  {
    icon: Pill,
    label: 'Medicine Delivery',
    desc: 'Prescription medicines delivered to your doorstep in hours.',
    gradient: 'from-emerald-500 to-teal-400',
    accent: '#10B981'
  },
  {
    icon: Brain,
    label: 'AI Health Advisor',
    desc: 'Get instant health insights powered by advanced AI.',
    gradient: 'from-amber-500 to-orange-400',
    accent: '#F59E0B'
  },
]

const highlights = [
  { icon: Stethoscope, label: 'Doctors Onboarded', value: '12+', desc: 'Active medical professionals' },
  { icon: Users, label: 'Patients Registered', value: '200+', desc: 'Growing user community' },
  { icon: Clock, label: 'Avg. Booking Time', value: '2 min', desc: 'Quick appointment setup' },
  { icon: Shield, label: 'Data Protected', value: '100%', desc: 'End-to-end encrypted' },
]

const capabilities = [
  { icon: Mic, title: 'Voice Consultations', desc: 'Talk to our AI for instant health guidance' },
  { icon: FileText, title: 'Health Records', desc: 'All your medical data in one secure place' },
  { icon: Activity, title: 'Vital Tracking', desc: 'Monitor your health metrics over time' },
]

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])

  useEffect(() => {
    setMounted(true)
    const ctx = gsap.context(() => {
      // Staggered hero animation
      gsap.fromTo(
        '.hero-animate',
        { opacity: 0, y: 80, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3
        }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#0a0a0a] to-[#030303]" />

        {/* Floating orbs */}
        <FloatingOrb
          className="top-[-200px] right-[-100px]"
          color="#8B5CF6"
          size={600}
          delay={0}
        />
        <FloatingOrb
          className="top-[40%] left-[-200px]"
          color="#3B82F6"
          size={500}
          delay={2}
        />
        <FloatingOrb
          className="bottom-[-100px] right-[20%]"
          color="#10B981"
          size={400}
          delay={4}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-[#030303]/80 backdrop-blur-2xl">
        <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
            >
              <Heart className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-lg font-bold tracking-tight">DIETEC</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'About', 'Doctors', 'Contact'].map((item) => (
              <Magnetic key={item}>
                <motion.a
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {item}
                </motion.a>
              </Magnetic>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Sign in
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-10 px-5 rounded-full bg-white text-black text-sm font-medium"
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hero-animate inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span className="text-sm text-white/70">
            AI-Powered Healthcare Platform
          </span>
        </motion.div>

        {/* Main Heading */}
        <h1 className="hero-animate text-center max-w-5xl mx-auto">
          <span className="block text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
            Healthcare
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mt-2">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-animate text-lg sm:text-xl text-white/50 max-w-2xl mx-auto text-center mt-8 leading-relaxed">
          Experience the future of healthcare. Book appointments, consult with AI,
          and manage your health—all in one seamless platform.
        </p>

        {/* CTA Buttons */}
        <div className="hero-animate flex flex-col sm:flex-row items-center gap-4 mt-12">
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative h-14 px-8 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-base font-medium flex items-center gap-2 shadow-lg shadow-violet-500/25"
            >
              <span>Start for Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <Link href="#features">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-14 px-8 rounded-full border border-white/20 text-base font-medium flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <span>Explore Features</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ height: [4, 12, 4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 bg-white/40 rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((item, i) => (
              <ScrollFadeIn key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.05] hover:border-white/10 transition-all"
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <item.icon className="w-8 h-8 text-violet-400 mb-4" />
                  <p className="text-4xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    {item.value}
                  </p>
                  <p className="text-sm text-white/40 mt-1">{item.desc}</p>
                </motion.div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollFadeIn className="text-center mb-20">
            <p className="text-sm text-violet-400 font-medium tracking-wider uppercase mb-4">
              Powerful Features
            </p>
            <TextReveal
              text="Everything you need for better health"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
            />
          </ScrollFadeIn>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <ScrollFadeIn key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="relative group p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm overflow-hidden hover:border-white/10 transition-all"
                >
                  {/* Gradient accent */}
                  <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ background: feature.accent }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-semibold mb-3">{feature.label}</h3>
                    <p className="text-white/50 leading-relaxed">{feature.desc}</p>

                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 mt-6 text-violet-400 font-medium"
                    >
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollFadeIn direction="left">
              <p className="text-sm text-violet-400 font-medium tracking-wider uppercase mb-4">
                AI-Powered
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                Your personal health advisor, powered by AI
              </h2>
              <p className="text-lg text-white/50 mb-8 leading-relaxed">
                Get instant answers to your health questions, symptom analysis,
                and personalized recommendations—available 24/7.
              </p>

              <div className="space-y-4">
                {capabilities.map((cap, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <cap.icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{cap.title}</h4>
                      <p className="text-sm text-white/40">{cap.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollFadeIn>

            <ScrollFadeIn direction="right">
              {/* Chat Demo */}
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-3xl blur-3xl" />

                <div className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">DIETEC AI</p>
                      <p className="text-xs text-green-400">● Online</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="flex justify-end"
                    >
                      <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-violet-600 max-w-[80%]">
                        <p className="text-sm">I&apos;ve been having headaches for 3 days</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="flex justify-start"
                    >
                      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/5 max-w-[80%]">
                        <p className="text-sm text-white/80">
                          I understand. Let me help you. Are you experiencing any other symptoms like
                          sensitivity to light, nausea, or neck stiffness?
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="flex justify-end"
                    >
                      <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-violet-600 max-w-[80%]">
                        <p className="text-sm">Just slight light sensitivity</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Typing indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center gap-2 mt-4 text-white/40"
                  >
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-white/40"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-white/40"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-white/40"
                      />
                    </div>
                    <span className="text-xs">AI is analyzing...</span>
                  </motion.div>
                </div>
              </div>
            </ScrollFadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollFadeIn>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative p-12 lg:p-16 rounded-3xl overflow-hidden text-center"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-blue-600/20" />
              <div className="absolute inset-0 backdrop-blur-sm" />
              <div className="absolute inset-[1px] rounded-3xl bg-[#030303]/80" />

              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl border border-white/10" />

              <div className="relative z-10">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-500/30"
                >
                  <Heart className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                  Ready to transform your healthcare?
                </h2>
                <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
                  Join thousands who trust DIETEC for their healthcare needs.
                </p>

                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-14 px-10 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-base font-medium inline-flex items-center gap-3 shadow-lg shadow-violet-500/25"
                  >
                    <Sparkles className="w-5 h-5" />
                    Get Started for Free
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">DIETEC</span>
            </div>

            <p className="text-sm text-white/40">
              © 2026 DIETEC Healthcare. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
