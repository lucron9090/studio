'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { saveUserSettings, getUserSettings } from '@/services/user-settings-service';
import { useEffect } from 'react';

const settingsFormSchema = z.object({
  openaiApiKey: z.string().min(1, 'API key cannot be empty.'),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

function SettingsForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      openaiApiKey: '',
    },
  });

  useEffect(() => {
    if (user) {
      getUserSettings(user.uid).then(settings => {
        if (settings) {
          form.setValue('openaiApiKey', settings.openaiApiKey);
        }
      });
    }
  }, [user, form]);

  async function onSubmit(data: SettingsFormValues) {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save settings.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await saveUserSettings(user.uid, data);
      toast({
        title: 'Settings saved',
        description: 'Your OpenAI API key has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="openaiApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OpenAI API Key</FormLabel>
              <FormControl>
                <Input placeholder="sk-..." {...field} type="password" />
              </FormControl>
              <FormDescription>
                Your API key is stored securely and is only used to send requests to the OpenAI API on your behalf.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>LLM API Keys</CardTitle>
          <CardDescription>Manage your API keys for external LLM providers.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm />
        </CardContent>
      </Card>
    </div>
  );
}
