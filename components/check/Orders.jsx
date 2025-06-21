'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, CreditCard, Truck, CheckCircle, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Orders() {
  const { data: session, status } = useSession();
  const router = useRouter()
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {

      if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/orders');
        return;
      } else if (status === 'authenticated') {
        try {
          setLoading(true);
          setError('');
          const response = await fetch(
            `/api/orders?userId=${session.user.id}&userEmail=${session.user.email}`,
            { cache: "no-store" }
          )
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
          setOrders(data.orders);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setError(error.message || 'Failed to load orders');
          toast.error(error.message || 'Failed to load orders');
        } finally {
          setLoading(false);
        }
      }
      fetchOrders();
    }
  }, [status, session, router]);

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

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
        <Link href="/login" className="bg-gray-900 p-3 rounded shadow-lg hover:bg-gray-950 text-white">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="text-2xl font-bold mt-4 mb-2">No Orders Yet</h1>
        <p className="text-gray-600 mb-6">Your order history will appear here.</p>
        <Button asChild className="bg-gray-900 text-white shadow-lg hover:bg-gray-950">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id} className="border-gray-200 shadow-sm">
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
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/orders/${order._id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Delivery Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Customer Name: {order.name}</p>
                    <p>Delivery Address: {order.address}</p>
                    <p>Customer Phone No: {order.phone}</p>
                    <p className="mt-2">
                      <span className="font-medium">Method:</span> {order.deliveryMethod}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Payment Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" />
                      <span>{order.paymentMethod}</span>
                    </div>
                    <p>
                      <span className="font-medium">Payment:</span> {order.paymentTime}
                    </p>
                    <p className="mt-4 text-lg font-medium">
                      Total: ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}