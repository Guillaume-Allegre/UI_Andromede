import { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { ActorNode } from './nodes/actor-node';
import { ToolNode } from './nodes/tool-node';
import { OrchestratorNode } from './nodes/orchestrator-node';
import { TriggerNode } from './nodes/trigger-node';
import { RewardNode } from './nodes/reward-node';
import { useWorkflowStore } from '@/store/workflow-store';

const nodeTypes = {
  actor: ActorNode,
  tool: ToolNode,
  orchestrator: OrchestratorNode,
  trigger: TriggerNode,
  reward: RewardNode,
};

function Flow() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    simulationAnimations
  } = useWorkflowStore();

  // Add animation styling to highlighted edges
  const animatedEdges = edges.map(edge => ({
    ...edge,
    animated: simulationAnimations.highlightedEdges.has(edge.id),
    style: simulationAnimations.highlightedEdges.has(edge.id) 
      ? { 
          stroke: '#3b82f6', 
          strokeWidth: 3,
          strokeDasharray: '10,5'
        }
      : {}
  }));

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={nodes}
        edges={animatedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-gray-50"
      >
        <Background 
          gap={20} 
          size={1}
          color="#e5e7eb"
        />
        <Controls 
          position="bottom-right"
          className="bg-white border border-gray-200 rounded-lg shadow-lg"
        />
        <MiniMap 
          position="bottom-left"
          className="bg-white border border-gray-200 rounded-lg"
          nodeColor="#6366f1"
        />
        <Panel position="top-center" className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-gray-600">
          Drag and drop nodes to design your workflow
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function CanvasArea() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
