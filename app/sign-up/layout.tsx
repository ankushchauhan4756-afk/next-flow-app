import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-krea-bg flex items-center justify-center">
      {children}
    </div>
  );
}
