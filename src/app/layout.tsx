import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const pretendard = localFont({
  src: [
    {
      path: '../fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sub Room - 구독 서비스 관리',
  description: 'OTT, VPN, 수강권 등 구독 서비스를 한눈에 관리하세요',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sub Room',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${pretendard.variable} antialiased`}>{children}</body>
    </html>
  );
}
