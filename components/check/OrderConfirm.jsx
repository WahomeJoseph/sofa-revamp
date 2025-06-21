'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
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
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/orders" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                      <div key={item.productId} className="flex gap-4">
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

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4 text-lg">Delivery Information</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>{order.name}</p>
                    <p>{order.address}</p>
                    <p>{order.city}, {order.postalCode}</p>
                    <p>{order.phone}</p>
                    <p>{order.email}</p>
                    <p className="mt-2">
                      <span className="font-medium">Delivery Method:</span> {order.deliveryMethod}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-lg">Payment Information</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" />
                      <span>{order.paymentMethod}</span>
                    </div>
                    <p>
                      <span className="font-medium">Payment Timing:</span> {order.paymentTime}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{order.deliveryMethod === 'Express' ? '$15.00' : 'Free'}</span>
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