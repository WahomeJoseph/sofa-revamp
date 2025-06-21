'use client'

import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import ShopFilters from './ShopFilters';
import { Button } from '@/components/ui/button';
import { Grid, List, ShoppingBag } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function Shop() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([])
    const [errors, setErrors] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDialogOpen, setProductDialogOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 500000]);
    const [sortBy, setSortBy] = useState('name-asc');
    const [viewMode, setViewMode] = useState('grid');
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true)
                const res = await fetch('/api/products', {
                    cache: 'no-store',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                if (!res.ok) { throw new Error('Failed to fetch products') }
                const data = await res.json();
                console.log('Fetched products:', data.products);
                setProducts(data.products || [])
            } catch (error) {
                toast.error('Failed to fetch shop products', { duration: 4000 })
                console.error('Error fetching products:', error)
                setErrors('Failed to fetch products!')
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [])

    const filteredProducts = useMemo(() => {
        let filtered = products.filter((product) => {
            const categoryMatch = selectedCategories.length === 0 ||
                selectedCategories.includes(product.category)
            const searchMatch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            const priceMatch =
                product.price >= priceRange[0] &&
                product.price <= priceRange[1]

            return categoryMatch && searchMatch && priceMatch
        }, [products, searchTerm, selectedCategories, priceRange]);

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'rating-desc':
                    return (b.rating || 0) - (a.rating || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [products, searchTerm, selectedCategories, priceRange, sortBy]);

    const handleToggleFavorite = (product) => {
        setFavorites((prev) => {
            const isFav = prev.includes(product._id);
            toast.success({
                title: isFav ? 'Removed from Favorites' : 'Added to Favorites',
                description: `${product.name} has been ${isFav ? 'removed from' : 'added to'} your favorites.`,
            });
            return isFav ? prev.filter((id) => id !== product._id) : [...prev, product._id];
        });
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
        setPriceRange([0, 500000]);
        setSortBy('name-asc');
    };

    if (loading) {
        return <div className="text-center py-16">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster position='top-center' richColors/>
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <ShoppingBag className="w-8 h-8 text-gray-900" />
                                Shop
                            </h1>
                            <p className="text-gray-600 mt-1 text-sm">Discover our amazing, quality sofa products at great prices</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className={viewMode === 'grid' ? 'border border-primary hover:bg-gray-100' : 'border-none'}>
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={viewMode === 'list' ? 'border border-primary hover:bg-gray-100' : 'border-none'}>
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="sticky top-8">
                            <ShopFilters
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                selectedCategories={selectedCategories}
                                onCategoryChange={setSelectedCategories}
                                priceRange={priceRange}
                                onPriceRangeChange={setPriceRange}
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                    </div>
                    {errors && (
                        <p className='text-center text-red-600 mb-4' role='alert'>
                            {errors}
                        </p>
                    )}

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-gray-600">
                                Showing {filteredProducts.length} of {products.length} products
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className={`grid gap-6 ${viewMode === 'grid'
                                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                                : 'grid-cols-1'}`}>
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product?._id}
                                        product={product}
                                        onToggleFavorite={handleToggleFavorite}
                                        isFavorite={favorites.includes(product._id)}
                                        setSelectedProduct={(product) => {
                                            setSelectedProduct(product)
                                            setProductDialogOpen(true)
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <ShoppingBag className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                                <Button onClick={handleClearFilters} variant="outline">
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};