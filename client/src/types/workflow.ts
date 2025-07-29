export type NodeType = 'actor' | 'tool' | 'orchestrator' | 'trigger' | 'reward';

export type ActorType = 'human' | 'agent' | 'system';

export interface NodeData {
  name: string;
  description?: string;
  config?: Record<string, any>;
  actorType?: ActorType;
  toolType?: string;
  icon?: string;
  color?: string;
}

export interface WorkflowNodeProps {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  selected?: boolean;
}

export interface WorkflowEdgeProps {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: Record<string, any>;
}

export interface SimulationMetrics {
  completionRate: number;
  successRate: number;
  averageResponseTime?: number;
  totalInteractions?: number;
}
