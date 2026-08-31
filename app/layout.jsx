import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import AuthBar from '../components/AuthBar';
export const metadata={title:'AdPage Builder V3',description:'Create and publish landing pages'};
export default function RootLayout({children}){return <ClerkProvider><html lang='en'><body><AuthBar />{children}</body></html></ClerkProvider>}
