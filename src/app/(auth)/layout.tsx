
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/operations');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <AuthLayoutContent>{children}</AuthLayoutContent>
  );
}
