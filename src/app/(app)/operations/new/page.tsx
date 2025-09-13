import { OperationWizard } from '@/components/OperationWizard';

export default function NewOperationPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Operation</h1>
      </div>
      <OperationWizard />
    </div>
  );
}
