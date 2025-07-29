import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { User, Bot, ServerCog, Users, Bus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { NodeData } from '@/types/workflow';

const iconMap = {
  user: User,
  robot: Bot,
  cogs: ServerCog,
  users: Users,
  'user-tie': Bus,
};

const colorMap = {
  blue: 'bg-blue-100 text-blue-600',
  gray: 'bg-gray-900 text-white',
  green: 'bg-green-100 text-green-600',
};

interface ActorNodeProps {
  data: NodeData;
  selected?: boolean;
}

export const ActorNode = memo(({ data, selected }: ActorNodeProps) => {
  const IconComponent = iconMap[data.icon as keyof typeof iconMap] || User;
  const colorClass = colorMap[data.color as keyof typeof colorMap] || colorMap.blue;

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

ActorNode.displayName = 'ActorNode';
