'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';
import LoaderSkeleton from '../theme/LoaderSkeleton';
import { User } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Phone } from 'lucide-react';
import { Mail } from 'lucide-react';
import { Separator } from '../ui/separator';
import { FaHandHoldingDollar } from "react-icons/fa6";

export default function OrderConfirm() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch order');

        setOrder(data.order);

        // Fetch product details for each item
        const productDetails = await Promise.all(
          data.order.orderItems.map(async (item) => {
            const productRes = await fetch(`/api/products/${item.productId}`);
            const productData = await productRes.json();
            return productRes.ok ? productData.product : null;
          })
        );

        setProducts(productDetails.filter(Boolean));
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Delivered
          </Badge>
        );
      case 'shipped':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Truck className="h-4 w-4 mr-1" />
            Shipped
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-4 w-4 mr-1" />
            Processing
          </Badge>
        );
    }
  };

  // if (loading) {
  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="flex justify-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  //       </div>
  //     </div>
  //   );
  // }
  if (loading) {
    return <LoaderSkeleton />
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="text-2xl font-bold mt-4 mb-2">Order Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6 bg-white/50 backdrop-blur-sm">
        <Link href="/orders" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="space-y-8">

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Order Confirmed!</h1>
              <p className="text-emerald-100">Thank you for your purchase. We're processing your order.</p>
            </div>
          </div>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 border-b">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="font-semibold text-lg">Order #{order.orderNumber}</h2>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-4 text-lg">Order Items</h3>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => {
                    const product = products[index];
                    return (
                      <div key={item.productId} className="flex gap-4 p-2 rounded bg-gray-50">
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <Image
                            src={product?.images?.[0] || '/placeholder.jpg'}
                            alt={product?.name || 'Product image'}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {product?.name || 'Product not found'}
                          </h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <div className='space-y-4'>
                  <h3 className="font-bold text-lg text-gray-900">Delivery Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <p className='flex items-center gap-2'><User className='font-light text-sm' size={16} />{order.name}</p>
                    <p className='flex items-center gap-2'><MapPin className='font-light text-sm' size={16} />{order.address}</p>
                    <p className='flex items-center gap-2'><Phone className='font-light text-sm' size={16} />{order.phone}</p>
                    <p className='flex items-center gap-2'><Mail className='font-light text-sm' size={16} />{order.email}</p>

                    <Separator className='bg-gray-900/20' />

                    <div className="mt-2 flex gap-20">
                      <span className="font-medium">Delivery Method:</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"> {order.deliveryMethod}</Badge>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className="font-bold text-lg text-gray-900">Payment Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <FaHandHoldingDollar className='font-light text-sm' size={16} />
                      <span>{order.paymentMethod} 07******78</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Payment Status:</span> {order.paymentTime}
                    </p>

                    <Separator className='bg-gray-900/20'/>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-2">
                        <span>Total:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button asChild className='bg-gray-900 text-white hover:gray-950'>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}