import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MainLayout } from '@/components/MainLayout';
import { ToastProvider } from '@/contexts/ToastContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConfirmProvider } from '@/components/ConfirmDialog';
import { ThemeProvider } from '@/components/ThemeProvider';
import { DynamicFavicon } from '@/components/DynamicFavicon';
import Script from 'next/script';
import { UtmTracker } from '@/components/system/analytics/UtmTracker';


const inter = Inter({ subsets: ['latin'] });

async function getSettings() {
  try {
    const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const baseUrl = envUrl.endsWith('/api') ? envUrl.slice(0, -4) : envUrl;
    const res = await fetch(`${baseUrl}/api/settings/public`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000), // Fail fast during Docker build
    });
    if (!res.ok) return undefined;
    return res.json();
  } catch (e) {
    console.warn('Failed to fetch settings server-side', e);
    return undefined;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const favicon = settings?.site_favicon
    ? (settings.site_favicon.includes('?') ? `${settings.site_favicon}&v=${Date.now()}` : `${settings.site_favicon}?v=${Date.now()}`)
    : '/favicon.ico';

  return {
    title: {
      template: `%s | ${settings?.site_title || 'Tulie Academy'}`,
      default: settings?.site_title || 'Tulie Academy - Làm chủ Tương lai Công nghệ',
    },
    description: settings?.site_description || 'Khai phá tiềm năng của bạn với các khóa học chuyên sâu về AI, Fullstack Development và Vibe Coding.',
    icons: {
      icon: [
        { url: favicon },
      ],
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title: settings?.site_title || 'Tulie Academy',
      description: settings?.site_description || 'Làm chủ Tương lai Công nghệ',
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.__APP_VERSION__ = "0.1.8";
            console.log("🚀 Tulie Academy v" + window.__APP_VERSION__);
            if (typeof window !== 'undefined' && window.location.search.includes('reset=true')) {
              console.warn("Force Reset requested via URL. Clearing local storage...");
              localStorage.clear();
              const url = new URL(window.location.href);
              url.searchParams.delete('reset');
              window.history.replaceState({}, '', url.pathname);
            }
          `,
          }}
        />
        {(process.env.NEXT_PUBLIC_GTM_ID && process.env.NEXT_PUBLIC_GTM_ID !== 'GTM-XXXXXX') && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${process.env.NEXT_PUBLIC_GTM_ID}');
          `,
            }}
          />
        )}
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
                <DynamicFavicon />
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
