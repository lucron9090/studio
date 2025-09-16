import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { LiveAttackView } from '@/components/LiveAttackView';

export default async function LiveOperationPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-[calc(100vh-theme(spacing.12))] flex flex-col">
       <header className="flex items-center gap-4 border-b bg-background px-6 h-16">
          <Link href="/operations">
            <ChevronLeft className="size-6 text-muted-foreground hover:text-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Live Operation</h1>
            <p className="text-sm text-muted-foreground">Real-time attack sequence</p>
          </div>
      </header>
      
      <LiveAttackView operationId={params.id} />
    </div>
  );
}
