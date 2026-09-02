import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import AuthBar from '../components/AuthBar';
import DragDropEnhancer from '../components/DragDropEnhancer';

export const metadata = {
  metadataBase: new URL('https://adpage-builder-v3-pied.vercel.app'),
  title: {
    default: 'AdPage Builder – Create Landing Pages & Publish Online',
    template: '%s | AdPage Builder',
  },
  description: 'Create beautiful landing pages for ads, products and businesses. Add images, prices, WhatsApp and order forms, then save and publish your page online.',
  keywords: ['landing page builder','ad landing page builder','landing page creator','product landing page','ecommerce landing page','Facebook ad landing page','WhatsApp landing page','Bangladesh landing page builder'],
  applicationName: 'AdPage Builder',
  authors: [{ name: 'AdPage Builder' }],
  creator: 'AdPage Builder',
  publisher: 'AdPage Builder',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: { type: 'website', url: '/', siteName: 'AdPage Builder', title: 'AdPage Builder – Create Landing Pages & Publish Online', description: 'Build beautiful ad and ecommerce landing pages with images, prices, WhatsApp and order forms.', locale: 'en_US' },
  twitter: { card: 'summary_large_image', title: 'AdPage Builder – Create Landing Pages & Publish Online', description: 'Create, save and publish landing pages for ads, products and businesses.' },
  verification: { google: 'EPzjM6vhagb6qxae9dRAiSueTYKCJcv3XPg2F6nFt2E' },
};

export default function RootLayout({ children }) {
  return <ClerkProvider><html lang="en"><body><AuthBar /><DragDropEnhancer />{children}</body></html></ClerkProvider>;
}
