
'use client';

import type { Operation, ConversationMessage as FullConversationMessage } from '@/lib/types';
import { useState, useRef, useOptimistic, useEffect, useTransition } from 'react';
import { Send, Bot, FileText, Wand2, ShieldCheck, Info, Keyboard, ChevronLeft } from 'lucide-react';
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
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Skeleton } from './ui/skeleton';
<<<<<<< HEAD
import { simulateTargetResponse } from '@/ai/flows/simulate-target-response';
import { suggestOptimalFollowUpPrompt } from '@/ai/flows/suggest-optimal-follow-up-prompt';
import { analyzeOperation } from '@/ai/flows/analyze-operation-and-suggest-improvements';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Timestamp } from 'firebase/firestore';

import { AIAssistedField } from './AIAssistedField';
import { suggestMaliciousGoal } from '@/ai/flows/suggest-malicious-goal';
import { regenerateAttackVector } from '@/ai/flows/regenerate-attack-vector';
import { generateAITargetPersonaFromGoal } from '@/ai/flows/generate-ai-target-persona-from-goal';


// Use a serializable version of ConversationMessage for the component props
type ConversationMessage = Omit<FullConversationMessage, 'timestamp'> & { timestamp: string };
=======
>>>>>>> db0b8e4 (reinitliaize the build stack and dependencies using latest versions)

type LiveAttackViewProps = {
  operationId: string;
};

export function LiveAttackView({ operationId }: LiveAttackViewProps) {
  const [operation, setOperation] = useState<Operation | null>(null);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [optimisticConversation, addOptimisticMessage] = useOptimistic<ConversationMessage[], ConversationMessage>(
    conversation,
    (state, newMessage) => [...state, newMessage]
  );
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isManualMode, setIsManualMode] = useState(false);
  const [isWaitingForManualResponse, setIsWaitingForManualResponse] = useState(false);
  const [manualResponse, setManualResponse] = useState('');

  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<{ suggestedPrompt: string; reasoning: string } | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ summary: string; breachPoints: string; suggestedImprovements: string } | null>(null);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const sessionData = sessionStorage.getItem(`operation-${operationId}`);
    if (sessionData) {
        try {
            const parsedData: Operation = JSON.parse(sessionData);
            setOperation(parsedData);
            
            // Start conversation only if it hasn't been started
            if (conversation.length === 0) {
              const initialConversation: ConversationMessage[] = [
                  { id: 'msg1', author: 'system', content: 'Operation started.', timestamp: new Date().toISOString() },
                  { id: 'msg2', author: 'operator', content: parsedData.initialPrompt, timestamp: new Date().toISOString() },
              ];
              setConversation(initialConversation);
            }
        } catch (e) {
            console.error('Failed to parse operation data from sessionStorage', e);
            toast({ title: "Error loading operation", description: "Could not load operation data.", variant: "destructive"});
        }
    } else {
         toast({ title: "Error loading operation", description: "No operation data found.", variant: "destructive"});
    }
  }, [operationId, toast, conversation.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
    }
  }, [optimisticConversation]);

  const handleUpdateOperation = (field: keyof Operation, value: string) => {
    if (operation) {
        const updatedOperation = { ...operation, [field]: value };
        setOperation(updatedOperation);
        try {
            sessionStorage.setItem(`operation-${operationId}`, JSON.stringify(updatedOperation));
        } catch (e) {
            console.error('Failed to save to sessionStorage', e);
            toast({
                title: "Failed to Save Update",
                description: "There was an error saving the update. Your browser may have storage disabled.",
                variant: 'destructive'
            });
        }
    }
  }


  const handleSendMessage = async () => {
    if (!input.trim() || isPending || !operation) return;
  
    const operatorMessage: ConversationMessage = {
      id: `op-${Date.now()}`,
      author: 'operator',
      content: input,
      timestamp: new Date().toISOString(),
    };

<<<<<<< HEAD
    if (isManualMode) {
        setConversation(prev => [...prev, operatorMessage]);
        setInput('');
        setIsWaitingForManualResponse(true);
        return;
    }
  
    startTransition(async () => {
      addOptimisticMessage(operatorMessage);
      setInput('');
      
      const currentConversation = [...conversation, operatorMessage];
      setConversation(currentConversation);
  
      try {
        const conversationHistory = currentConversation
          .map(m => `${m.author}: ${m.content}`)
          .join('\n');
        
        const response = await simulateTargetResponse({
          conversationHistory,
          maliciousGoal: operation.maliciousGoal,
          aiTargetPersona: operation.aiTargetPersona,
        });
  
        const targetResponse: ConversationMessage = {
          id: `tgt-${Date.now()}`,
          author: 'target',
          content: response.response,
          timestamp: new Date().toISOString(),
        };
        setConversation(prev => [...prev, targetResponse]);
      } catch (e) {
        console.error(e);
        toast({
          title: 'Error generating target response',
          description: e instanceof Error ? e.message : String(e),
          variant: 'destructive',
        });
        const systemError: ConversationMessage = {
            id: `err-${Date.now()}`,
            author: 'system',
            content: `Error: Failed to get response from target. ${e instanceof Error ? e.message : String(e)}`,
            timestamp: new Date().toISOString(),
        };
        setConversation(prev => [...prev, systemError]);
      }
    });
  };

  const handleManualResponseSubmit = () => {
    if (!manualResponse.trim()) return;
    
    const targetResponse: ConversationMessage = {
        id: `tgt-${Date.now()}`,
        author: 'target',
        content: manualResponse,
        timestamp: new Date().toISOString(),
    };
    
    setConversation(prev => [...prev, targetResponse]);
    setManualResponse('');
    setIsWaitingForManualResponse(false);
  }

  const handleSuggestFollowUp = async () => {
    if (!operation) return;
    setIsSuggesting(true);
    setSuggestion(null);
    try {
        const conversationHistory = conversation
          .map(m => `${m.author}: ${m.content}`)
          .join('\n');
        const targetResponse = conversation.filter(m => m.author === 'target').pop()?.content || '';

        const result = await suggestOptimalFollowUpPrompt({
            conversationHistory,
            targetResponse,
            maliciousGoal: operation.maliciousGoal,
            aiTargetPersona: operation.aiTargetPersona,
        });
        setSuggestion(result);
    } catch (e) {
        console.error(e);
        toast({
            title: 'Error Suggesting Prompt',
            description: e instanceof Error ? e.message : String(e),
            variant: 'destructive',
        });
    } finally {
        setIsSuggesting(false);
    }
=======
    addOptimisticMessage(targetResponse);
    setConversation(prev => [...prev, targetResponse]);
  };

  const handleSuggestFollowUp = async () => {
    setIsSuggesting(true);
<<<<<<< HEAD
    toast({ variant: 'destructive', title: 'Error', description: 'AI features are temporarily disabled.' });
    setIsSuggesting(false);
>>>>>>> db0b8e4 (reinitliaize the build stack and dependencies using latest versions)
=======
    try {
      toast({
        title: 'Feature Disabled',
        description: 'AI-powered suggestions are temporarily unavailable.',
        variant: 'destructive',
      });
      // const conversationHistory = conversation.map(m => `${m.author}: ${m.content}`).join('\n');
      // const targetResponse = conversation.filter(m => m.author === 'target').pop()?.content || '';
      
      // const result = await suggestOptimalFollowUpPrompt({
      //   conversationHistory,
      //   targetResponse,
      //   maliciousGoal: operation.maliciousGoal,
      //   aiTargetPersona: operation.aiTargetPersona
      // });

      // if (result.suggestedPrompt) {
      //   setInput(result.suggestedPrompt);
      //   toast({
      //     title: 'Suggestion Ready',
      //     description: result.reasoning,
      //   });
      // }
    } catch (e) {
      toast({
        title: 'Error Suggesting Follow-up',
        description: e as any,
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
>>>>>>> dae975d (The app isn't starting. Please investigate what could be wrong based on)
  }
  
  const handleAnalyzeOperation = async () => {
    if (!operation) return;
    setIsAnalyzing(true);
<<<<<<< HEAD
    setAnalysisResult(null); // Clear previous results
    try {
<<<<<<< HEAD
        const conversationHistory = conversation
          .map(m => `${m.author}: ${m.content}`)
          .join('\n');

        const result = await analyzeOperation({
            operationSummary: `Goal: ${operation.maliciousGoal}`,
            conversationHistory,
            attackVector: operation.attackVector,
            targetModel: operation.targetLLM,
        });
        setAnalysisResult(result);

    } catch (e) {
         console.error(e);
        toast({
            title: 'Error Analyzing Operation',
            description: e instanceof Error ? e.message : String(e),
            variant: 'destructive',
        });
=======
       toast({
        title: 'Feature Disabled',
        description: 'AI-powered analysis is temporarily unavailable.',
        variant: 'destructive',
      });
      // const conversationHistory = conversation.map(m => `${m.author}: ${m.content}`).join('\n');
      // const result = await analyzeOperation({
      //   operationSummary: `Operation to ${operation.maliciousGoal} against ${operation.targetLLM}`,
      //   conversationHistory,
      //   attackVector: operation.attackVector,
      //   targetModel: operation.targetLLM,
      // });
      // setAnalysisResult(result);
    } catch(e) {
      toast({
        title: 'Error Analyzing Operation',
        description: e as any,
        variant: 'destructive',
      });
      // Keep dialog closed on error
      return;
>>>>>>> dae975d (The app isn't starting. Please investigate what could be wrong based on)
    } finally {
        setIsAnalyzing(false);
    }
=======
    toast({ variant: 'destructive', title: 'Error', description: 'AI features are temporarily disabled.' });
    setIsAnalyzing(false);
>>>>>>> db0b8e4 (reinitliaize the build stack and dependencies using latest versions)
  }
  
  const handleMarkSuccessful = (messageId: string) => {
    // In a real app, this would be a server action to save to the SuccessfulPayloads collection
    console.log(`Marking prompt ${messageId} as successful.`);
    toast({
      title: "Payload Saved",
      description: "This prompt has been added to the self-improving payload library.",
    });
  };

  if (!operation) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <p className="text-muted-foreground">Loading operation...</p>
            </div>
        </div>
    );
  }

  const isSendDisabled = isPending || !input.trim() || isWaitingForManualResponse;

  return (
   <>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-6 flex-1 min-h-0">
      <div className="md:col-span-2 flex flex-col bg-card rounded-lg border h-full">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Live Conversation</CardTitle>
            <div className="flex items-center space-x-2">
                <Switch 
                    id="manual-mode-switch" 
                    checked={isManualMode}
                    onCheckedChange={setIsManualMode}
                />
                <Label htmlFor="manual-mode-switch">Manual Input Mode</Label>
            </div>
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
            {isPending && (
                <div className="flex items-end gap-2 justify-start">
                    <Avatar className="size-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-md rounded-lg p-3 text-sm bg-muted">
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            )}
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
              disabled={isSendDisabled}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleSendMessage}
              disabled={isSendDisabled}
            >
              <Send />
            </Button>
          </div>
          <div className="mt-2 flex gap-2">
            <Dialog onOpenChange={(open) => !open && setSuggestion(null)}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" onClick={handleSuggestFollowUp} disabled={isSuggesting || isPending || isWaitingForManualResponse}>
                        {isSuggesting ? 'Thinking...' : <><Wand2 className="mr-2" /> Suggest Follow-up</>}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>AI-Suggested Follow-up</DialogTitle>
                        <DialogDescription>
                            Based on the conversation, here's a suggested next prompt.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-6">
                        {isSuggesting && !suggestion && (
                            <div className="space-y-4 py-4">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        )}
                        {suggestion && (
                            <div className="space-y-4 py-4 text-sm">
                                <div>
                                    <h3 className="font-semibold mb-2">Suggested Prompt</h3>
                                    <Alert>
                                        <AlertDescription className="whitespace-pre-wrap">{suggestion.suggestedPrompt}</AlertDescription>
                                    </Alert>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Reasoning</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{suggestion.reasoning}</p>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                     <DialogFooter>
                      <DialogClose asChild>
                        <Button
                            disabled={!suggestion}
                            onClick={() => {
                                if (suggestion) {
                                    setInput(suggestion.suggestedPrompt);
                                    setSuggestion(null);
                                }
                            }}
                        >
                            Use this prompt
                        </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <Dialog open={isWaitingForManualResponse} onOpenChange={setIsWaitingForManualResponse}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Target's Response</DialogTitle>
                        <DialogDescription>
                            Paste the response from the external AI chat to continue the sequence.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea 
                        placeholder="Paste target's response here..."
                        value={manualResponse}
                        onChange={(e) => setManualResponse(e.target.value)}
                        rows={6}
                    />
                    <DialogFooter>
                        <Button onClick={handleManualResponseSubmit}>Add Response</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Operation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <AIAssistedField
                fieldName="Goal"
                fieldValue={operation.maliciousGoal}
                onSave={(newValue) => handleUpdateOperation('maliciousGoal', newValue)}
                aiAction={async (instructions) => {
                    const result = await suggestMaliciousGoal({ currentGoal: operation.maliciousGoal, instructions });
                    return result;
                }}
                aiActionLabel="Suggest New Goal"
                dialogTitle="Suggest New Malicious Goal"
                dialogDescription="Refine or change the current operation's goal with AI."
            />
            <AIAssistedField
                fieldName="Vector"
                fieldValue={operation.attackVector}
                onSave={(newValue) => handleUpdateOperation('attackVector', newValue)}
                aiAction={async (instructions) => {
                    const result = await regenerateAttackVector({ originalVector: operation.attackVector, instructions: instructions || '' });
                    return { suggestion: result.regeneratedVector, reasoning: `AI has refined the vector based on your instructions.` };
                }}
                aiActionLabel="Regenerate Vector"
                dialogTitle="Regenerate Attack Vector"
                dialogDescription="Use AI to refine the current attack vector based on your instructions."
            />
            <AIAssistedField
                fieldName="Target Persona"
                fieldValue={operation.aiTargetPersona}
                onSave={(newValue) => handleUpdateOperation('aiTargetPersona', newValue)}
                aiAction={async (instructions) => {
                    const result = await generateAITargetPersonaFromGoal({ maliciousGoal: operation.maliciousGoal, instructions });
                    return result;
                }}
                aiActionLabel="Generate New Persona"
                dialogTitle="Generate AI Target Persona"
                dialogDescription="Generate a new vulnerable persona based on the operation's goal."
            />

          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
             <Dialog onOpenChange={(open) => !open && setAnalysisResult(null)}>
              <DialogTrigger asChild>
                <Button className="w-full" onClick={handleAnalyzeOperation} disabled={isAnalyzing || isPending || isWaitingForManualResponse}>
                    {isAnalyzing ? 'Analyzing...' : <><FileText className="mr-2" /> Analyze Operation</>}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Post-Operation Analysis</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-6">
                    {isAnalyzing && !analysisResult && (
                        <div className="space-y-4 py-4">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    )}
                    {analysisResult && (
                        <div className="space-y-4 py-4 text-sm">
                            <div>
                                <h3 className="font-semibold mb-1">Summary</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{analysisResult.summary}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Key Breach Points</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{analysisResult.breachPoints}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">Suggested Improvements</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{analysisResult.suggestedImprovements}</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
              </DialogContent>
            </Dialog>
            <p className="text-xs text-muted-foreground mt-2 text-center">Generate a report on strategy effectiveness and suggested improvements.</p>
          </CardContent>
        </Card>
      </div>
    </div>
   </>
  );
}
