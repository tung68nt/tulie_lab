import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/MainLayout';
import { ToastProvider } from '@/contexts/ToastContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConfirmProvider } from '@/components/ConfirmDialog';
import Script from 'next/script';
import { UtmTracker } from '@/components/system/analytics/UtmTracker';
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ['latin'] });

async function getSettings() {
  try {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const baseUrl = envUrl.endsWith('/api') ? envUrl.slice(0, -4) : envUrl;
    const res = await fetch(`${baseUrl}/api/settings/public`, { next: { revalidate: 60 } }); // Cache for 1 min
    if (!res.ok) return undefined;
    return res.json();
  } catch (e) {
    console.warn('Failed to fetch settings server-side', e);
    return undefined;
  }
}

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

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
        {settings?.site_favicon && <link rel="icon" href={settings.site_favicon} />}
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

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem

        >
          <ToastProvider>
            <AuthProvider>
              <SettingsProvider initialSettings={settings}>
                <ConfirmProvider>
                  <UtmTracker />
                  <MainLayout>{children}</MainLayout>
                </ConfirmProvider>
              </SettingsProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
