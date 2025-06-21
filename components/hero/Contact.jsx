"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { Mails, Headset, MapPinned } from 'lucide-react';

export default function Contact(){
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for your message. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      title: 'Visit Our Showroom',
      details: ['Tumaini, Rongai', 'Nairobi, Kenya'],
      icon: <MapPinned />
    },
    {
      title: 'Call Us',
      details: ['(254) 79596-9757', 'Mon-Fri: 9AM-6PM', 'Sat-Sun: 9AM-5PM'],
      icon: <Headset />
    },
    {
      title: 'Email Us',
      details: ['info@sofalux.com', 'support@sofalux.com', 'sales@sofalux.com'],
      icon: <Mails />
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-300/10">
      <Toaster />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about our sofas or services? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Contact Information</h3>
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-0 shadow-lg bg-slate-200/10">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <span className="text-2xl mr-3">{info.icon}</span>
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Name <span className='text-red-600'>*</span>
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Phone <span className='text-red-600'>*</span>
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email <span className='text-red-600'>*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Message <span className='text-red-600'>*</span>
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us about your sofa needs..."
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full bg-gray-900 text-gray-100 cursor-pointer p-6 hover-scale">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};