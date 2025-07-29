import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { ServerCog } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { NodeData } from '@/types/workflow';

interface OrchestratorNodeProps {
  data: NodeData;
  selected?: boolean;
}

export const OrchestratorNode = memo(({ data, selected }: OrchestratorNodeProps) => {
  return (
    <Card className={`relative w-48 p-4 transition-shadow hover:shadow-xl ${
      selected ? 'ring-2 ring-primary' : ''
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
          <ServerCog className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{data.name}</h3>
          <p className="text-sm text-gray-500">{data.description}</p>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </Card>
  );
});

OrchestratorNode.displayName = 'OrchestratorNode';
