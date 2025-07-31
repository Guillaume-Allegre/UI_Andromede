import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { User, Bot, ServerCog, Users, Bus, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useWorkflowStore } from '@/store/workflow-store';
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
  id: string;
  data: NodeData;
  selected?: boolean;
}

export const ActorNode = memo(({ id, data, selected }: ActorNodeProps) => {
  const { simulationAnimations } = useWorkflowStore();
  const hasTalkingBubble = simulationAnimations.talkingBubbles.has(id);
  
  const IconComponent = iconMap[data.icon as keyof typeof iconMap] || User;
  const colorClass = colorMap[data.color as keyof typeof colorMap] || colorMap.blue;

  return (
    <Card className={`relative w-48 p-4 transition-shadow hover:shadow-xl ${
      selected ? 'ring-2 ring-primary' : ''
    }`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      {/* Talking Bubble Animation */}
      {hasTalkingBubble && (
        <div className="absolute -top-2 -left-2 animate-bounce">
          <div className="bg-blue-500 text-white rounded-full p-1 shadow-lg">
            <MessageCircle className="w-4 h-4" />
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

ActorNode.displayName = 'ActorNode';
