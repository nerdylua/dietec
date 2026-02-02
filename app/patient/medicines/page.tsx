'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    ArrowLeft,
    Search,
    Pill,
    Plus,
    Minus,
    ShoppingCart,
    X,
    ChevronRight,
    Check
} from 'lucide-react'

const medicines = [
    { id: 1, name: 'Paracetamol 500mg', brand: 'Crocin', category: 'Pain Relief', price: 25, prescription: false, inStock: true },
    { id: 2, name: 'Azithromycin 500mg', brand: 'Azee', category: 'Antibiotic', price: 120, prescription: true, inStock: true },
    { id: 3, name: 'Omeprazole 20mg', brand: 'Omez', category: 'Digestive', price: 85, prescription: false, inStock: true },
    { id: 4, name: 'Metformin 500mg', brand: 'Glycomet', category: 'Diabetes', price: 45, prescription: true, inStock: true },
    { id: 5, name: 'Vitamin D3 60K IU', brand: 'Calcirol', category: 'Vitamins', price: 150, prescription: false, inStock: true },
    { id: 6, name: 'Cetirizine 10mg', brand: 'Zyrtec', category: 'Allergy', price: 35, prescription: false, inStock: false },
    { id: 7, name: 'Pantoprazole 40mg', brand: 'Pan-D', category: 'Digestive', price: 95, prescription: false, inStock: true },
    { id: 8, name: 'Amoxicillin 500mg', brand: 'Mox', category: 'Antibiotic', price: 85, prescription: true, inStock: true },
]

const categories = ['All', 'Pain Relief', 'Antibiotic', 'Digestive', 'Diabetes', 'Vitamins', 'Allergy']

interface CartItem {
    id: number
    quantity: number
}

export default function MedicinesPage() {
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [cart, setCart] = useState<CartItem[]>([])
    const [showCart, setShowCart] = useState(false)

    const filteredMedicines = medicines.filter(med => {
        const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase()) ||
            med.brand.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const addToCart = (id: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === id)
            if (existing) {
                return prev.map(item =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                )
            }
            return [...prev, { id, quantity: 1 }]
        })
    }

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + delta
                    return newQty > 0 ? { ...item, quantity: newQty } : item
                }
                return item
            }).filter(item => item.quantity > 0)
        })
    }

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id))
    }

    const cartTotal = cart.reduce((sum, item) => {
        const med = medicines.find(m => m.id === item.id)
        return sum + (med?.price || 0) * item.quantity
    }, 0)

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
            {/* Grid background */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Header */}
            <header className="sticky top-0 z-50 h-16 border-b border-[#EAEAEA] dark:border-[#333] bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl">
                <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/patient"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <h1 className="text-[15px] font-semibold text-[#171717] dark:text-white">Medicines</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={() => setShowCart(true)}
                            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[11px] font-medium rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Search & Filters */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search medicines..."
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#EAEAEA] dark:border-[#333] bg-white dark:bg-[#111] text-[14px] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#171717] dark:focus:ring-white focus:ring-offset-2 transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                                        ? 'bg-[#171717] dark:bg-white text-white dark:text-[#171717]'
                                        : 'bg-[#F5F5F5] dark:bg-[#222] text-[#666] dark:text-[#888] hover:bg-[#EAEAEA] dark:hover:bg-[#333]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Medicines Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMedicines.map((med) => {
                        const inCart = cart.find(item => item.id === med.id)
                        return (
                            <div
                                key={med.id}
                                className={`p-5 rounded-xl border ${med.inStock
                                        ? 'border-[#EAEAEA] dark:border-[#333] hover:border-[#CCC] dark:hover:border-[#555]'
                                        : 'border-[#EAEAEA] dark:border-[#333] opacity-60'
                                    } bg-white dark:bg-[#111] transition-colors`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                        <Pill className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    {med.prescription && (
                                        <span className="px-2 py-0.5 text-[11px] font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">
                                            Rx
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-[15px] font-medium text-[#171717] dark:text-white mb-1">{med.name}</h3>
                                <p className="text-[13px] text-[#666] dark:text-[#888] mb-3">{med.brand}</p>

                                <div className="flex items-center justify-between">
                                    <span className="text-[18px] font-bold text-[#171717] dark:text-white">₹{med.price}</span>

                                    {med.inStock ? (
                                        inCart ? (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(med.id, -1)}
                                                    className="w-8 h-8 rounded-lg border border-[#EAEAEA] dark:border-[#333] flex items-center justify-center text-[#666] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-[14px] font-medium text-[#171717] dark:text-white">
                                                    {inCart.quantity}
                                                </span>
                                                <button
                                                    onClick={() => addToCart(med.id)}
                                                    className="w-8 h-8 rounded-lg bg-[#171717] dark:bg-white flex items-center justify-center text-white dark:text-[#171717] hover:bg-[#333] dark:hover:bg-[#EAEAEA] transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(med.id)}
                                                className="h-9 px-4 rounded-lg bg-[#171717] dark:bg-white text-white dark:text-[#171717] text-[13px] font-medium hover:bg-[#333] dark:hover:bg-[#EAEAEA] transition-colors flex items-center gap-1"
                                            >
                                                <Plus className="w-3 h-3" />
                                                Add
                                            </button>
                                        )
                                    ) : (
                                        <span className="text-[13px] text-[#999]">Out of stock</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>

            {/* Cart Sidebar */}
            {showCart && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={() => setShowCart(false)}
                    />
                    <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#0A0A0A] z-50 flex flex-col">
                        <div className="h-16 px-6 flex items-center justify-between border-b border-[#EAEAEA] dark:border-[#333]">
                            <h2 className="text-[18px] font-semibold text-[#171717] dark:text-white">Cart ({cartCount})</h2>
                            <button
                                onClick={() => setShowCart(false)}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#666] dark:text-[#888] hover:bg-[#F5F5F5] dark:hover:bg-[#222] transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingCart className="w-12 h-12 text-[#CCC] mx-auto mb-4" />
                                    <p className="text-[15px] text-[#666] dark:text-[#888]">Your cart is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => {
                                        const med = medicines.find(m => m.id === item.id)
                                        if (!med) return null
                                        return (
                                            <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border border-[#EAEAEA] dark:border-[#333]">
                                                <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                                    <Pill className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[14px] font-medium text-[#171717] dark:text-white truncate">{med.name}</p>
                                                    <p className="text-[13px] text-[#666] dark:text-[#888]">₹{med.price} × {item.quantity}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-7 h-7 rounded border border-[#EAEAEA] dark:border-[#333] flex items-center justify-center text-[#666] hover:bg-[#F5F5F5] dark:hover:bg-[#222]"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-[13px] font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => addToCart(item.id)}
                                                            className="w-7 h-7 rounded border border-[#EAEAEA] dark:border-[#333] flex items-center justify-center text-[#666] hover:bg-[#F5F5F5] dark:hover:bg-[#222]"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[14px] font-bold text-[#171717] dark:text-white">₹{med.price * item.quantity}</p>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-[12px] text-red-500 hover:underline mt-1"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-[#EAEAEA] dark:border-[#333]">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[15px] text-[#666] dark:text-[#888]">Total</span>
                                    <span className="text-[24px] font-bold text-[#171717] dark:text-white">₹{cartTotal}</span>
                                </div>
                                <button className="w-full h-11 rounded-lg bg-emerald-600 text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
                                    <Check className="w-4 h-4" />
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
