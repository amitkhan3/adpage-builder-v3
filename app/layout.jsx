import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
export const metadata={title:'AdPage Builder V3',description:'Create and publish landing pages'};
export default function RootLayout({children}){return <ClerkProvider><html lang='en'><body>{children}</body></html></ClerkProvider>}