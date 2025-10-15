import { Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton' | 'inline';
}

export function LoadingState({ message = 'Loading...', variant = 'spinner' }: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader className="h-4 w-4 animate-spin" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2">
      <Loader className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function OperationListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}
