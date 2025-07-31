import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Mail, Calendar, Cloud, Brain, Wrench, Cog } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useWorkflowStore } from '@/store/workflow-store';
import type { NodeData } from '@/types/workflow';

const iconMap = {
  envelope: Mail,
  calendar: Calendar,
  cloud: Cloud,
  brain: Brain,
  wrench: Wrench,
};

const colorMap = {
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  gray: 'bg-gray-900 text-white',
  yellow: 'bg-yellow-500 text-white',
};

interface ToolNodeProps {
  id: string;
  data: NodeData;
  selected?: boolean;
}

export const ToolNode = memo(({ id, data, selected }: ToolNodeProps) => {
  const { simulationAnimations } = useWorkflowStore();
  const hasProcessingGear = simulationAnimations.processingGears.has(id);
  
  const IconComponent = iconMap[data.icon as keyof typeof iconMap] || Wrench;
  const colorClass = colorMap[data.color as keyof typeof colorMap] || colorMap.gray;

  return (
    <Card className={`relative w-48 p-4 transition-shadow hover:shadow-xl ${
      selected ? 'ring-2 ring-primary' : ''
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      {/* Processing Gear Animation */}
      {hasProcessingGear && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-green-500 text-white rounded-full p-1 shadow-lg">
            <Cog className="w-4 h-4 animate-spin" />
          </div>
        </div>
      )}
      
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

ToolNode.displayName = 'ToolNode';
