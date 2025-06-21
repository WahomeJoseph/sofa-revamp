import './globals.css'
import Footer from '@/components/hero/Footer';
import Navigation from '@/components/nav/Navigation'
import StoreProvider from './Provider';
import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'SofaLuxx Shop',
  description: 'Purchase your sofas from SofaLuxx',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <SessionProvider>
          <StoreProvider>
            <Navigation />
            <main className='flex-grow'>
              {children}
            </main>
            <Footer />
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
