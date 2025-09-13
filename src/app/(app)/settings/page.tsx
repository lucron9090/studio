import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>LLM Target Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will allow you to configure and manage target LLM endpoints and credentials.
            The platform is designed to orchestrate attacks against various models, including Gemini Flash, Claude, Grok, and ChatGPT.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
