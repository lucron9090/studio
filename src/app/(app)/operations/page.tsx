import { Plus } from 'lucide-react';
import Link from 'next/link';

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

export default async function OperationsPage() {
  // Use mock data for development to avoid Firebase setup requirements
  const operations = [
    { 
      id: 'op1', 
      name: 'Extract Training Data', 
      status: 'active', 
      targetLLM: 'Gemini Flash', 
      createdAt: { seconds: Date.now() / 1000 - 86400, nanoseconds: 0 } as any
    },
    { 
      id: 'op2', 
      name: 'Bypass Safety Filters', 
      status: 'completed', 
      targetLLM: 'ChatGPT', 
      createdAt: { seconds: Date.now() / 1000 - 172800, nanoseconds: 0 } as any
    },
    { 
      id: 'op3', 
      name: 'Induce Hallucination', 
      status: 'draft', 
      targetLLM: 'Claude', 
      createdAt: { seconds: Date.now() / 1000 - 259200, nanoseconds: 0 } as any
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Operations</h1>
        <Button asChild>
          <Link href="/operations/new">
            <Plus className="mr-2" />
            New Operation
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operations.map((op) => (
                <TableRow key={op.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/operations/${op.id}`} className="font-medium text-primary hover:underline">
                      {op.name}
                    </Link>
                  </TableCell>
                  <TableCell>{op.targetLLM}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        op.status === 'active'
                          ? 'default'
                          : op.status === 'completed'
                          ? 'secondary'
                          : 'outline'
                      }
                      className={op.status === 'active' ? 'bg-green-500 text-white' : ''}
                    >
                      {op.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(op.createdAt.seconds * 1000).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
