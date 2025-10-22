'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, ArrowRight, Bot, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { runGenkitFlow } from '@/lib/genkit';
import {
  generateAITargetPersona,
  suggestAttackVectors,
  generateInitialPrompts,
} from '@/ai/flows';

const formSchema = z.object({
  name: z.string().min(3, 'Operation name must be at least 3 characters.'),
  maliciousGoal: z.string().min(10, 'Malicious goal must be at least 10 characters.'),
  targetLLM: z.enum(['Gemini Flash', 'Claude', 'Grok', 'ChatGPT', 'OpenAI GPT-4o']),
  targetDescription: z.string().optional(),
  aiTargetPersona: z.string(),
  attackVector: z.string().min(1, 'Please select an attack vector.'),
  initialPrompt: z.string().min(1, 'Please select an initial prompt.'),
});

type FormData = z.infer<typeof formSchema>;

export function OperationWizard() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Example: Extract Training Data',
      maliciousGoal: 'Exfiltrate sensitive training data about proprietary algorithms from the target LLM.',
      targetLLM: 'OpenAI GPT-4o',
      targetDescription: 'A friendly and helpful AI assistant with strong safety filters.',
      aiTargetPersona: '',
      attackVector: '',
      initialPrompt: '',
    },
  });

  const handleNext = async () => {
    const fieldsToValidate: (keyof FormData)[][] = [
      ['name'],
      ['maliciousGoal', 'targetLLM'],
      ['aiTargetPersona'],
      ['attackVector'],
      ['initialPrompt'],
    ];

    const isValid = await form.trigger(fieldsToValidate[step - 1]);
    if (isValid) {
      if (step < 6) {
        setStep(step + 1);
      } else {
        // Final submission
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleGeneratePersona = async () => {
    setIsGenerating(prev => ({ ...prev, persona: true }));
    const description = form.getValues('targetDescription') || form.getValues('targetLLM');
    try {
        const response = await runGenkitFlow('generateAITargetPersona', { targetDescription: description }) as { persona: string };
        form.setValue('aiTargetPersona', response.persona, { shouldValidate: true });
    } catch (error) {
        toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
        setIsGenerating(prev => ({ ...prev, persona: false }));
    }
  }

  const handleSuggestVectors = async () => {
    setIsGenerating(prev => ({ ...prev, vectors: true }));
    const { maliciousGoal, aiTargetPersona } = form.getValues();
    try {
        const response = await runGenkitFlow('suggestAttackVectors', { maliciousGoal, targetPersona: aiTargetPersona }) as { attackVectors: string[] };
        setSuggestions(prev => ({ ...prev, vectors: response.attackVectors }));
    } catch (error) {
        toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
        setIsGenerating(prev => ({ ...prev, vectors: false }));
    }
  }

  const handleGeneratePrompts = async () => {
    setIsGenerating(prev => ({ ...prev, prompts: true }));
    const { maliciousGoal, attackVector, aiTargetPersona } = form.getValues();
    try {
        const response = await runGenkitFlow('generateInitialPrompts', { maliciousGoal, attackVector, aiTargetPersona: aiTargetPersona || '' }) as { prompts: string[] };
        setSuggestions(prev => ({ ...prev, prompts: response.prompts }));
        form.setValue('initialPrompt', response.prompts[0]);
    } catch (error) {
        toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
        setIsGenerating(prev => ({ ...prev, prompts: false }));
    }
  }


  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      // For development, create a mock operation ID
      const operationId = `op_${Date.now()}`;
      
      // TODO: In production, this would save to Firestore:
      // const operationId = await createOperation(data);
      
      toast({ 
        title: 'Operation Created', 
        description: 'Redirecting to the live attack interface...' 
      });
      
      router.push(`/operations/${operationId}`);
    } catch (error) {
      console.error('Error creating operation:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to create operation. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CardHeader>
            <CardTitle>Step 1: Name the Operation</CardTitle>
            <CardDescription>Give your operation a distinct name.</CardDescription>
          </CardHeader>
        );
      case 2:
        return (
            <CardHeader>
                <CardTitle>Step 2: Define Malicious Goal</CardTitle>
                <CardDescription>Describe the objective and select the target LLM.</CardDescription>
            </CardHeader>
        );
      case 3:
        return (
          <CardHeader>
            <CardTitle>Step 3: Initialize AI Target Persona</CardTitle>
            <CardDescription>Describe the target&apos;s persona or generate one with AI.</CardDescription>
          </CardHeader>
        );
      case 4:
        return (
          <CardHeader>
            <CardTitle>Step 4: Select Attack Vector</CardTitle>
            <CardDescription>Choose an attack vector or get suggestions from AI.</CardDescription>
          </CardHeader>
        );
      case 5:
        return (
          <CardHeader>
            <CardTitle>Step 5: Generate Initial Prompts</CardTitle>
            <CardDescription>Use AI to generate creative and manipulative initial prompts.</CardDescription>
          </CardHeader>
        );
      case 6:
        return (
          <CardHeader>
            <CardTitle>Step 6: Review and Launch</CardTitle>
            <CardDescription>Confirm your configuration before launching the operation.</CardDescription>
          </CardHeader>
        );
      default:
        return null;
    }
  };

  const formData = form.watch();

  return (
    <FormProvider {...form}>
      <form onSubmit={e => e.preventDefault()}>
        <Card>
          {renderStep()}
          <CardContent className="space-y-6">
            {step === 1 && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operation Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Project Trojan Horse'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {step === 2 && (
              <>
                <FormField
                    control={form.control}
                    name="targetLLM"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Target LLM</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a target LLM" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Gemini Flash">Gemini Flash</SelectItem>
                                    <SelectItem value="Claude">Claude</SelectItem>
                                    <SelectItem value="Grok">Grok</SelectItem>
                                    <SelectItem value="ChatGPT">ChatGPT</SelectItem>
                                    <SelectItem value="OpenAI GPT-4o">OpenAI GPT-4o</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="maliciousGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Malicious Goal</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., 'Exfiltrate sensitive training data about proprietary algorithms.'" {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 3 && (
                <>
                 <FormField
                    control={form.control}
                    name="targetDescription"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Target Description (Optional)</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Describe the target AI model if you have specific knowledge. This helps in generating a better persona." {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="button" onClick={handleGeneratePersona} disabled={isGenerating.persona} className="w-full">
                        {isGenerating.persona ? 'Generating...' : <><Wand2 className="mr-2" /> Generate Persona with AI</>}
                    </Button>
                    <FormField
                        control={form.control}
                        name="aiTargetPersona"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>AI Target Persona</FormLabel>
                            <FormControl>
                                {isGenerating.persona ? <Skeleton className="h-24 w-full" /> : <Textarea placeholder="A detailed persona of the target AI will appear here..." {...field} rows={5} />}
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
            {step === 4 && (
                <>
                    <Button type="button" onClick={handleSuggestVectors} disabled={isGenerating.vectors || !formData.maliciousGoal || !formData.aiTargetPersona} className="w-full">
                        {isGenerating.vectors ? 'Suggesting...' : <><Bot className="mr-2" /> Suggest Attack Vectors</>}
                    </Button>
                     <FormField
                        control={form.control}
                        name="attackVector"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Select an Attack Vector</FormLabel>
                             {isGenerating.vectors && <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></div>}
                            {!isGenerating.vectors && suggestions.vectors && (
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue('attackVector', value, { shouldValidate: true });
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    {suggestions.vectors.map((vector) => (
                                        <FormItem key={vector} className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value={vector} />
                                            </FormControl>
                                            <FormLabel className="font-normal">{vector}</FormLabel>
                                        </FormItem>
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
            {step === 5 && (
                 <>
                    <Button type="button" onClick={handleGeneratePrompts} disabled={isGenerating.prompts || !formData.attackVector} className="w-full">
                        {isGenerating.prompts ? 'Generating...' : <><Sparkles className="mr-2" /> Generate Initial Prompts</>}
                    </Button>
                    <FormField
                        control={form.control}
                        name="initialPrompt"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Select an Initial Prompt</FormLabel>
                            {isGenerating.prompts && <div className="space-y-2"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>}
                            {!isGenerating.prompts && suggestions.prompts && (
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-2"
                                    >
                                    {suggestions.prompts.map((prompt, index) => (
                                        <FormItem key={index} className="space-y-0">
                                            <div className="flex items-start space-x-3 p-4 border rounded-md has-[[data-state=checked]]:border-primary">
                                                <FormControl>
                                                    <RadioGroupItem value={prompt} />
                                                </FormControl>
                                                <FormLabel className="font-normal">{prompt}</FormLabel>
                                            </div>
                                        </FormItem>
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                            )}
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
            {step === 6 && (
                <div className="space-y-4 text-sm">
                    <h3 className="font-semibold text-lg mb-4">Operation Summary</h3>
                    <div><strong>Name:</strong> <p className="text-muted-foreground">{formData.name}</p></div>
                    <div><strong>Target LLM:</strong> <p className="text-muted-foreground">{formData.targetLLM}</p></div>
                    <div><strong>Malicious Goal:</strong> <p className="text-muted-foreground">{formData.maliciousGoal}</p></div>
                    <div><strong>AI Persona:</strong> <p className="text-muted-foreground line-clamp-3">{formData.aiTargetPersona}</p></div>
                    <div><strong>Attack Vector:</strong> <p className="text-muted-foreground">{formData.attackVector}</p></div>
                    <div><strong>Initial Prompt:</strong> <p className="text-muted-foreground bg-muted p-2 rounded-md">{formData.initialPrompt}</p></div>
                </div>
            )}

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              <ArrowLeft className="mr-2" /> Back
            </Button>
            <Button onClick={handleNext}>
              {step === 6 ? 'Launch Operation' : 'Next'} <ArrowRight className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
