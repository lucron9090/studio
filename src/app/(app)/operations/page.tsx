
import { Plus, Zap, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOperations } from '@/services/operation-service';
import { auth } from '@/lib/firebase/config';
import { OperationsClientPage } from './operations-client-page';


async function getInitialOperations() {
    // In a real app, you would get the current user's ID from the session
    // For this server component, we'll assume a placeholder or handle unauthenticated state
    const userId = auth.currentUser?.uid;
    if (!userId) {
        return [];
    }
    const operations = await getOperations(userId);
    return operations.map(op => ({
      ...op,
      createdAt: op.createdAt ? new Date((op.createdAt as Timestamp).seconds * 1000).toISOString() : new Date().toISOString(),
      updatedAt: op.updatedAt ? new Date((op.updatedAt as Timestamp).seconds * 1000).toISOString() : new Date().toISOString(),
    }));
}


export default async function OperationsPage() {
  const initialOperations = await getInitialOperations();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Operations</h1>
        <div className="flex gap-2">
           <Button disabled>
            <Zap className="mr-2" />
            Quick Start
          </Button>
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
            <OperationsClientPage initialOperations={initialOperations} />
        </CardContent>
      </Card>
    </div>
  );
}

