
import { LiveAttackView } from '@/components/LiveAttackView';

export default async function LiveOperationPage({ params }: { params: { id: string }}) {
  const operationId = params.id;

  return (
    <div className="h-[calc(100vh-theme(spacing.12))] flex flex-col">
       <LiveAttackView operationId={operationId} />
    </div>
  );
}
