import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Zap, Clock, Webhook } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { NodeData } from '@/types/workflow';

const iconMap = {
  zap: Zap,
  clock: Clock,
  webhook: Webhook,
};

const colorMap = {
  yellow: 'bg-yellow-500 text-white',
  orange: 'bg-orange-500 text-white',
  purple: 'bg-purple-500 text-white',
};

interface TriggerNodeProps {
  data: NodeData;
  selected?: boolean;
}

export const TriggerNode = memo(({ data, selected }: TriggerNodeProps) => {
  const IconComponent = iconMap[data.icon as keyof typeof iconMap] || Zap;
  const colorClass = colorMap[data.color as keyof typeof colorMap] || colorMap.yellow;

  return (
    <Card className={`relative w-48 p-4 transition-shadow hover:shadow-xl ${
      selected ? 'ring-2 ring-primary' : ''
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
          <IconComponent className="w-5 h-5" />
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

TriggerNode.displayName = 'TriggerNode';