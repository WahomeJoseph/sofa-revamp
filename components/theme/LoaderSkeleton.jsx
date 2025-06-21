import React from 'react'
import { Card, CardHeader, CardContent } from '../ui/card'

export default function LoaderSkeleton() {
    return (
        <div>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="space-y-6">
                        <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                            <CardHeader className="p-8">
                                <div className="space-y-4">
                                    <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                                        {[1, 2].map((i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
