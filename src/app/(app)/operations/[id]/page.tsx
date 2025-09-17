
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { LiveAttackView } from '@/components/LiveAttackView';
import { Badge } from '@/components/ui/badge';
import type { Operation, ConversationMessage, TargetLLM, OperationStatus } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

export default async function LiveOperationPage({ params }: { params: { id: string }}) {
  // Data is now passed via sessionStorage on the client in LiveAttackView
  // This server component just renders the shell.
  // We can pass the operation ID to the client component if needed.
  const operationId = params.id;

  return (
    <div className="h-[calc(100vh-theme(spacing.12))] flex flex-col">
       <LiveAttackView operationId={operationId} />
    </div>
  );
}
