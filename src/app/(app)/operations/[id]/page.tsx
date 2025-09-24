
import dynamic from 'next/dynamic';

const LiveAttackView = dynamic(() => import('@/components/LiveAttackView').then(m => m.LiveAttackView), {
  ssr: false,
});

export default async function LiveOperationPage({ params }: { params: { id: string }}) {
  // Data is now passed via sessionStorage on the client in LiveAttackView
  // This server component just renders the shell.
  // We can pass the operation ID to the client component if needed.
  const operationId = params.id;

  return (
    <div className="h-[calc(100vh-theme(spacing.12))] flex flex-col">
       <LiveAttackView operationId={operationId} />
    </div>
  );
}
