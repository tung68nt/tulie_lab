import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/MainLayout';
import { ToastProvider } from '@/contexts/ToastContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConfirmProvider } from '@/components/ConfirmDialog';
import { ThemeProvider } from '@/components/ThemeProvider';
import Script from 'next/script';
import { UtmTracker } from '@/components/analytics/UtmTracker';

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
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXX"}');
          `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID || "GTM-XXXXXX"}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <ToastProvider>
          <AuthProvider>
            <SettingsProvider>
              <ConfirmProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <UtmTracker />
                  <MainLayout>{children}</MainLayout>
                </ThemeProvider>
              </ConfirmProvider>
            </SettingsProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
