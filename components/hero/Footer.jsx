"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import { Facebook, Twitter, Instagram, Youtube,MapPin, ArrowRight } from "lucide-react";
import { Headset } from "lucide-react";
import { Mails } from "lucide-react";
import { MapPinned } from "lucide-react";

export default function Footer() {
    const footerSections = [
        {
            title: "Shop",
            links: [
                { name: "All Sofas", href: "/products" },
                { name: "2-Seater Sofas", href: "/products/2-seater" },
                { name: "3-Seater Sofas", href: "/products/3-seater" },
                { name: "Sectional Sofas", href: "/products/sectional" },
                { name: "Leather Sofas", href: "/products/leather" },
                { name: "Fabric Sofas", href: "/products/fabric" },
            ],
        },
        {
            title: "Services",
            links: [
                { name: "Sofa Cleaning", href: "/services/cleaning" },
                { name: "Sofa Revamp", href: "/services/revamp" },
                { name: "Delivery Service", href: "/services/delivery" },
                { name: "Assembly Service", href: "/services/assembly" },
                { name: "Warranty Service", href: "/services/warranty" },
                { name: "Custom Orders", href: "/services/custom" },
            ],
        },
        {
            title: "Customer Care",
            links: [
                { name: "Contact Us", href: "/contact" },
                { name: "Order Tracking", href: "/track-order" },
                { name: "Returns & Exchanges", href: "/returns" },
                { name: "Size Guide", href: "/size-guide" },
                { name: "Care Instructions", href: "/care" },
                { name: "FAQ", href: "/faq" },
            ],
        },
        {
            title: "Company",
            links: [
                { name: "About Us", href: "/about" },
                { name: "Our Story", href: "/story" },
                { name: "Careers", href: "/careers" },
                { name: "Press", href: "/press" },
                { name: "Sustainability", href: "/sustainability" },
                { name: "Reviews", href: "/reviews" },
            ],
        },
    ];

    return (
        <footer className="bg-muted/30 pt-16 pb-8">
            <div className="w-full mx-auto px-0">
                {/* Newsletter */}
                <div className="bg-gray-900 text-white rounded-2xl mb-16 mx-[6rem] p-8 text-primary-foreground">
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
                        <p className="mb-6 opacity-90">
                            Get exclusive offers, design tips, and early access to new collections
                        </p>
                        <div className="flex gap-2 max-w-md mx-auto">
                            <Input
                                placeholder="Enter your email"
                                className="bg-white text-black border-0"
                            />
                            <Button variant="secondary" size="icon" className='w-auto p-2 bg-white text-gray-900 cursor-pointer'>
                                <span className="text-gray-900">Send</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs mt-4 opacity-75">
                            By subscribing, you agree to our Privacy Policy and Terms of Service
                        </p>
                    </div>
                </div>

                {/* Main Footer Grid */}
                <div className="px-10 py-16  mb-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
                        {/* Brand Section */}
                        <div className="lg:col-span-4 space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                    SofaLuxx
                                </h2>
                                <div className="w-12 h-1 bg-gradient-to-r from-gray-600 to-indigo-600 rounded-full mb-6"></div>
                                <p className="text-gray-600 leading-relaxed text-base max-w-md">
                                    Transform your living space with our premium collection of sofas.
                                    Crafted for comfort, designed for style, built to last a lifetime.
                                </p>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">
                                    Reach Out
                                </h3>
                                <div className="space-y-3">
                                    <a
                                        href="tel:+254795969757"
                                        className="flex items-center gap-3 text-gray-600 hover:text-gray-600 transition-colors duration-200 group">
                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                                            <Headset className="h-5 w-5 text-gray-900" />
                                        </div>
                                        <span className="text-sm font-medium">+254 795 969 757</span>
                                    </a>

                                    <a
                                        href="mailto:hello@sofaluxx.com"
                                        className="flex items-center gap-3 text-gray-600 hover:text-gray-600 transition-colors duration-200 group">
                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                                            <Mails className="h-5 w-5 text-gray-900" />
                                        </div>
                                        <span className="text-sm font-medium">hello@sofaluxx.com</span>
                                    </a>

                                    <div className="flex items-start gap-3 text-gray-600">
                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg mt-0.5">
                                            <MapPinned className="h-5 w-5 text-gray-900" />
                                        </div>
                                        <span className="text-sm font-medium leading-relaxed">
                                            Tumaini, Rongai<br />
                                            Nairobi, Kenya
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Links Sections */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {footerSections.map((section) => (
                                    <div key={section.title} className="space-y-4">
                                        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">
                                            {section.title}
                                        </h3>
                                        <ul className="space-y-3">
                                            {section.links.map((link) => (
                                                <li key={link.name}>
                                                    <a
                                                        href={link.href}
                                                        className="text-sm text-gray-600 hover:text-gray-600 transition-colors duration-200 block py-1 relative group">
                                                        <span className="relative">
                                                            {link.name}
                                                            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                                                        </span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <Separator className="bg-gray-200" />

                <div className="px-6 py-8 lg:px-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center px-20 gap-6">
                        <div className="text-sm text-gray-500 text-center lg:text-left">
                            <span className="block lg:inline">© 2025 SofaLuxx. All rights reserved.</span>
                            <span className="hidden lg:inline mx-2">•</span>
                            <a href="#" className="hover:text-gray-700 transition-colors underline underline-offset-4">
                                Privacy Policy
                            </a>
                            <span className="mx-2">•</span>
                            <a href="#" className="hover:text-gray-700 transition-colors underline underline-offset-4">
                                Terms of Service
                            </a>
                        </div>

                        {/* Social Media */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 font-medium">Follow us:</span>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">
                                    <Facebook className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">
                                    <Twitter className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">
                                    <Instagram className="h-5 w-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-600 transition-all duration-200 shadow-sm hover:shadow-md">
                                    <Youtube className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};