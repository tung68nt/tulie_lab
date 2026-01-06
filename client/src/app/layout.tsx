import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/MainLayout';
import { ToastProvider } from '@/contexts/ToastContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Academy Tulie',
    default: 'Academy Tulie - Làm chủ Tương lai Công nghệ',
  },
  description: 'Khai phá tiềm năng của bạn với các khóa học chuyên sâu về AI, Fullstack Development và Vibe Coding.',
  openGraph: {
    title: 'Academy Tulie',
    description: 'Làm chủ Tương lai Công nghệ',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ToastProvider>
          <AuthProvider>
            <SettingsProvider>
              <MainLayout>{children}</MainLayout>
            </SettingsProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
