import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PayloadsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Successful Payloads</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payload Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section will display a collection of successful attack prompts saved from various operations.
            The &apos;ORATOR&apos; flow uses this library to improve the effectiveness of future AI-generated attacks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
