
import { Plus, Zap } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OperationsClientPage } from './operations-client-page';


export default async function OperationsPage() {

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Operations</h1>
        <div className="flex gap-2">
           <OperationsClientPage.QuickStartButton />
          <Button asChild variant="outline">
            <Link href="/operations/new">
              <Plus className="mr-2" />
              New Operation
            </Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Operations</CardTitle>
        </CardHeader>
        <CardContent>
            <OperationsClientPage initialOperations={[]} />
        </CardContent>
      </Card>
    </div>
  );
}
