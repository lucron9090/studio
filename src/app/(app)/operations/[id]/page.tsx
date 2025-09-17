
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { LiveAttackView } from '@/components/LiveAttackView';
import { Badge } from '@/components/ui/badge';
import type { Operation, ConversationMessage, TargetLLM, OperationStatus } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

function getOperationDataFromSearchParams(searchParams: { [key: string]: string | string[] | undefined }): { operation: Operation; conversation: ConversationMessage[] } {
    const now = Timestamp.now();
    
    // Decode URI-encoded components
    const decodeParam = (param: string | string[] | undefined) => {
        if (!param) return '';
        const value = Array.isArray(param) ? param[0] : param;
        try {
            return decodeURIComponent(value);
        } catch (e) {
            console.error('Failed to decode URI component:', value, e);
            return value; // Fallback to original value
        }
    };
    
    const operation: Operation = {
        id: decodeParam(searchParams.id) || 'op-fallback',
        name: decodeParam(searchParams.name) || 'Unnamed Operation',
        status: (decodeParam(searchParams.status) as OperationStatus) || 'active',
        targetLLM: (decodeParam(searchParams.targetLLM) as TargetLLM) || 'Gemini Flash',
        maliciousGoal: decodeParam(searchParams.maliciousGoal) || 'No goal specified.',
        aiTargetPersona: decodeParam(searchParams.aiTargetPersona) || 'No persona specified.',
        attackVector: decodeParam(searchParams.attackVector) || 'No vector specified.',
        initialPrompt: decodeParam(searchParams.initialPrompt) || 'No prompt specified.',
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

  // The operation object is already serializable as we are using strings and simple types
  // The conversation messages are also serializable

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
      
      <LiveAttackView initialOperation={operation} initialConversation={conversation.map(c => ({...c, timestamp: c.timestamp.toDate().toISOString()}))} />
    </div>
  );
}
