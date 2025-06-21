import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json()
        const { name, email, phone, service, date, time, address, message, preferredContact} = body
        if (!name || !email || !phone || !service || !date || !time || !address || !message || !preferredContact) {
            return NextResponse.json({ message: 'Please fill all the required fields!' }, { status: 400 });
        }
        const contact = await Contact.create({
            name,
            email,
            phone,
            service,
            date,
            time,
            address,
            message,
            preferredContact,
        })
        return NextResponse.json(
            { message: 'Contact created successfully', contact },
            { status: 201 }
        );
        // else if (!/^\+?\d{10,15}$/.test(form.phone) || form.phone.length < 10) {
        //     newErrors.phone = "Invalid phone number format (e.g., +254712345678 or 0712345678)";
        //     newErrors.phone = "Phone number must be at least 10 digits long";
        //   }
    } catch (error) {
        console.log('Failed to submit contact!', error.message);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}