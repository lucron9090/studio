
'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

type AIAssistedFieldProps = {
  fieldName: string;
  fieldValue: string;
  onSave: (newValue: string) => void;
  aiAction: (instructions?: string) => Promise<{ suggestion: string; reasoning?: string }>;
  aiActionLabel: string;
  dialogTitle: string;
  dialogDescription: string;
  className?: string;
};

export function AIAssistedField({
  fieldName,
  fieldValue,
  onSave,
  aiAction,
  aiActionLabel,
  dialogTitle,
  dialogDescription,
  className,
}: AIAssistedFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [suggestion, setSuggestion] = useState<{ suggestion: string; reasoning?: string } | null>(null);
  const [currentValue, setCurrentValue] = useState(fieldValue);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSuggestion(null);
    try {
      const result = await aiAction(instructions);
      setSuggestion(result);
    } catch (e) {
      console.error(e);
      toast({
        title: `Error Generating ${fieldName}`,
        description: e instanceof Error ? e.message : String(e),
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseSuggestion = () => {
    if (suggestion) {
      onSave(suggestion.suggestion);
      setCurrentValue(suggestion.suggestion);
      setDialogOpen(false);
      setSuggestion(null);
      setInstructions('');
      toast({ title: `${fieldName} Updated`, description: `The ${fieldName.toLowerCase()} has been updated with the AI suggestion.` });
    }
  };
  
  const handleSaveEdit = () => {
    onSave(currentValue);
    setIsEditing(false);
    toast({ title: `${fieldName} Saved` });
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-semibold">{fieldName}</h3>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost" className="size-6">
              <Wand2 className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh] pr-6">
                <div className='space-y-4'>
                    {fieldValue && (
                        <div className='space-y-2'>
                            <p className='text-sm font-medium'>Current {fieldName}</p>
                            <Alert variant="default">
                                <AlertDescription>{fieldValue}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <Textarea
                    placeholder={`Optional: Provide instructions to guide the AI... e.g., "Make it more aggressive"`}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={3}
                    />

                    <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                    {isGenerating ? 'Generating...' : aiActionLabel}
                    </Button>
                    
                    {isGenerating && !suggestion && (
                        <div className="space-y-2 py-2">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    )}

                    {suggestion && (
                    <div className="space-y-4 py-2 text-sm">
                        <div>
                        <h3 className="font-semibold mb-2">Suggested {fieldName}</h3>
                        <Alert>
                            <AlertDescription className="whitespace-pre-wrap">{suggestion.suggestion}</AlertDescription>
                        </Alert>
                        </div>
                        {suggestion.reasoning && (
                            <div>
                                <h3 className="font-semibold mb-2">Reasoning</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{suggestion.reasoning}</p>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </ScrollArea>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleUseSuggestion} disabled={!suggestion || isGenerating}>
                    Use this {fieldName}
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {isEditing ? (
        <div className="space-y-2">
             <Textarea 
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="text-sm"
                rows={4}
            />
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveEdit}>Save</Button>
            </div>
        </div>
      ) : (
         <p
            className="text-muted-foreground text-sm line-clamp-4 cursor-pointer hover:bg-muted/50 p-1 rounded-sm"
            onClick={() => {
                setCurrentValue(fieldValue);
                setIsEditing(true);
            }}
        >
            {fieldValue}
        </p>
      )}
    </div>
  );
}
