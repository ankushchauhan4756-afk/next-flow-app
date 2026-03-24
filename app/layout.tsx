import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'NextFlow - LLM Workflow Builder',
  description: 'A pixel-perfect Krea.ai clone for building LLM workflows',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isValidKey = publishableKey && !publishableKey.includes('test_example');
  
  const content = (
    <html lang="en">
      <body>{children}</body>
    </html>
  );

  return isValidKey ? (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  ) : (
    content
  );
}
