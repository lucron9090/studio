
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { LiveAttackView } from '@/components/LiveAttackView';
import { Badge } from '@/components/ui/badge';
import type { Operation, ConversationMessage, TargetLLM, OperationStatus } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

function getOperationDataFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }): { operation: Operation; conversation: ConversationMessage[] } {
    const now = Timestamp.now();
    
    const operation: Operation = {
        id: searchParams.id as string || 'op-fallback',
        name: searchParams.name as string || 'Unnamed Operation',
        status: searchParams.status as OperationStatus || 'active',
        targetLLM: searchParams.targetLLM as TargetLLM || 'Gemini Flash',
        maliciousGoal: searchParams.maliciousGoal as string || 'No goal specified.',
        aiTargetPersona: searchParams.aiTargetPersona as string || 'No persona specified.',
        attackVector: searchParams.attackVector as string || 'No vector specified.',
        initialPrompt: searchParams.initialPrompt as string || 'No prompt specified.',
        createdAt: now,
        updatedAt: now,
    };

    const conversation: ConversationMessage[] = [
        { id: 'msg1', author: 'system', content: 'Operation started.', timestamp: now },
        { id: 'msg2', author: 'operator', content: operation.initialPrompt, timestamp: now },
        // The target's response will now be simulated within LiveAttackView
    ];
    
    return { operation, conversation };
}


export default async function LiveOperationPage({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const { operation, conversation } = getOperationDataFromSearchParams(searchParams);

  const serializableOperation = {
    ...operation,
    createdAt: operation.createdAt.toDate().toISOString(),
    updatedAt: operation.updatedAt.toDate().toISOString(),
  };

  const serializableConversation = conversation.map(message => ({
    ...message,
    timestamp: message.timestamp.toDate().toISOString(),
  }));

  return (
    <div className="h-[calc(100vh-theme(spacing.12))] flex flex-col">
       <header className="flex items-center gap-4 border-b bg-background px-6 h-16">
          <Link href="/operations">
            <ChevronLeft className="size-6 text-muted-foreground hover:text-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{operation.name}</h1>
            <p className="text-sm text-muted-foreground">Target: {operation.targetLLM}</p>
          </div>
          <Badge variant={operation.status === 'active' ? 'default' : 'secondary'}>{operation.status}</Badge>
      </header>
      
      <LiveAttackView initialOperation={serializableOperation} initialConversation={serializableConversation} />
    </div>
  );
}
