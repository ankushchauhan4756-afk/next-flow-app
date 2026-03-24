'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to dashboard in demo mode
    const hasValidClerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                             !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('test_example');
    
    if (hasValidClerkKey) {
      router.push('/dashboard');
    } else {
      // In demo mode, show dashboard directly
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-krea-bg">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">NextFlow</h1>
        <p className="text-gray-400 mb-8">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
