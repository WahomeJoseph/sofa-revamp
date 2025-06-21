import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_SECRET_KEY
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')

    const tokenRes = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    )

    const token = tokenRes.data.access_token
    if (!token) {
      throw new Error('Failed to fetch access token!')
    }

    const { phone, amount } = await request.json()
    if (!phone || !amount) {
      return NextResponse.json(
        { message: 'Phone and amount are required!' },
        { status: 400 }
      )
    }

    const formattedPhone = phone.startsWith('254')
      ? phone
      : `254${phone.replace(/^0/, '').replace(/\D/g, '')}`

    const shortcode = process.env.MPESA_SHORTCODE
    const passKey = process.env.MPESA_PASSKEY

    const date = new Date()
    const timeStamp =
      date.getFullYear() +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      ('0' + date.getDate()).slice(-2) +
      ('0' + date.getHours()).slice(-2) +
      ('0' + date.getMinutes()).slice(-2) +
      ('0' + date.getSeconds()).slice(-2)

    const password = Buffer.from(`${shortcode}${passKey}${timeStamp}`).toString('base64')
    const url = process.env.MPESA_URL

    const data = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timeStamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: 'Sofa Lux',
      TransactionDesc: 'Purchase',
    }

    console.log('STK push request data', data)

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'STK push initiated successfully!',
        data: response.data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in M-Pesa API:', error.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Payment processing failed',
        error: error.response?.data || error.message
      },
      { status: error.response?.status || 500 }
    );
  }
}