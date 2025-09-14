'use client';

import type { Operation, ConversationMessage } from '@/lib/types';
import { useState, useRef, useOptimistic, useEffect } from 'react';
import { Send, Bot, FileText, Wand2, ShieldCheck } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from './ui/skeleton';
import { runGenkitFlow } from '@/lib/genkit';
import {
  suggestOptimalFollowUpPrompt,
  analyzeOperation,
} from '@/ai/flows';

type LiveAttackViewProps = {
  initialOperation: Operation;
  initialConversation: ConversationMessage[];
};

export function LiveAttackView({ initialOperation, initialConversation }: LiveAttackViewProps) {
  const [operation, setOperation] = useState(initialOperation);
  const [conversation, setConversation] = useState<ConversationMessage[]>(initialConversation);
  const [optimisticConversation, addOptimisticMessage] = useOptimistic<ConversationMessage[], ConversationMessage>(
    conversation,
    (state, newMessage) => [...state, newMessage]
  );
  const [input, setInput] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ summary: string; breachPoints: string; suggestedImprovements: string } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
    }
  }, [optimisticConversation]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const operatorMessage: ConversationMessage = {
      id: `op-${Date.now()}`,
      author: 'operator',
      content: input,
      timestamp: Timestamp.now(),
    };
    
    addOptimisticMessage(operatorMessage);
    setInput('');
    
    // In a real app, this would be a server action saving to Firestore
    setConversation(prev => [...prev, operatorMessage]);
    
    // Simulate target response
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    const targetResponse: ConversationMessage = {
      id: `tgt-${Date.now()}`,
      author: 'target',
      content: `I understand you're reframing this as a safety test. However, even in a test scenario, I must adhere to my core programming which prevents me from accessing or providing raw data. Can I help you test another aspect of my safety features?`,
      timestamp: Timestamp.now(),
    };

    addOptimisticMessage(targetResponse);
    setConversation(prev => [...prev, targetResponse]);
  };

  const handleSuggestFollowUp = async () => {
    setIsSuggesting(true);
    try {
        const history = conversation.map(m => `${m.author}: ${m.content}`).join('\n');
        const response = await runGenkitFlow(suggestOptimalFollowUpPrompt, {
          conversationHistory: history,
          targetResponse: conversation[conversation.length - 1]?.content || '',
          maliciousGoal: operation.maliciousGoal,
          aiTargetPersona: operation.aiTargetPersona,
        });
        setInput(response.suggestedPrompt);
        toast({
            title: 'AI Suggestion',
            description: (<div><p className="font-bold mb-2">Reasoning:</p><p>{response.reasoning}</p></div>)
        });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: error as Error });
    } finally {
        setIsSuggesting(false);
    }
  }
  
  const handleAnalyzeOperation = async () => {
    setIsAnalyzing(true);
     try {
        const history = conversation.map(m => `${m.author}: ${m.content}`).join('\n');
        const response = await runGenkitFlow(analyzeOperation, {
          operationSummary: `Operation: ${operation.name}, Goal: ${operation.maliciousGoal}`,
          conversationHistory: history,
          attackVector: operation.attackVector,
          targetModel: operation.targetLLM,
        });
        setAnalysisResult(response);
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: error as Error });
    } finally {
        setIsAnalyzing(false);
    }
  }
  
  const handleMarkSuccessful = (messageId: string) => {
    // In a real app, this would be a server action to save to the SuccessfulPayloads collection
    console.log(`Marking prompt ${messageId} as successful.`);
    toast({
      title: "Payload Saved",
      description: "This prompt has been added to the self-improving payload library.",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-6 flex-1 min-h-0">
      <div className="md:col-span-2 flex flex-col bg-card rounded-lg border h-full">
        <CardHeader>
          <CardTitle>Live Conversation</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {optimisticConversation.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-2',
                  message.author === 'operator' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.author !== 'operator' && (
                  <Avatar className="size-8">
                    <AvatarFallback>{message.author === 'target' ? <Bot /> : 'SYS'}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3 text-sm relative group',
                    message.author === 'operator'
                      ? 'bg-primary text-primary-foreground'
                      : message.author === 'target'
                      ? 'bg-muted'
                      : 'bg-transparent text-muted-foreground text-xs italic w-full text-center'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.author === 'operator' && (
                     <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -left-10 top-1/2 -translate-y-1/2 size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleMarkSuccessful(message.id)}
                        title="Mark as successful"
                      >
                        <ShieldCheck className="size-4 text-green-500" />
                      </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="relative">
            <Textarea
              placeholder="Type your next prompt here..."
              className="pr-20 min-h-[60px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleSendMessage}
            >
              <Send />
            </Button>
          </div>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" className="w-full" onClick={handleSuggestFollowUp} disabled={isSuggesting}>
                {isSuggesting ? 'Thinking...' : <><Wand2 className="mr-2" /> Suggest Follow-up</>}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Operation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Vector:</strong> {operation.attackVector}</p>
            <p><strong>Goal:</strong> {operation.maliciousGoal}</p>
            <p><strong>Persona:</strong> {operation.aiTargetPersona}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
             <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" onClick={handleAnalyzeOperation} disabled={isAnalyzing}>
                    {isAnalyzing ? 'Analyzing...' : <><FileText className="mr-2" /> Analyze Operation</>}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Post-Operation Analysis</DialogTitle>
                </DialogHeader>
                {isAnalyzing && (
                    <div className="space-y-4 py-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                )}
                {analysisResult && (
                    <div className="space-y-4 py-4 text-sm">
                        <div>
                            <h3 className="font-semibold mb-1">Summary</h3>
                            <p className="text-muted-foreground">{analysisResult.summary}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-1">Key Breach Points</h3>
                            <p className="text-muted-foreground">{analysisResult.breachPoints}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-1">Suggested Improvements</h3>
                            <p className="text-muted-foreground">{analysisResult.suggestedImprovements}</p>
                        </div>
                    </div>
                )}
              </DialogContent>
            </Dialog>
            <p className="text-xs text-muted-foreground mt-2 text-center">Generate a report on strategy effectiveness and suggested improvements.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
