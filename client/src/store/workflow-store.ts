import { create } from 'zustand';
import { Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, Connection } from 'reactflow';
import type { NodeData, SimulationMetrics, NodeType } from '@/types/workflow';

interface WorkflowState {
  // Canvas state
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: Node<NodeData> | null;
  
  // UI state
  activeTab: string;
  isSimulationRunning: boolean;
  showSimulationModal: boolean;
  simulationResults: any;
  showAddComponentModal: boolean;
  addComponentType: NodeType | null;
  
  // Sidebar state
  expandedSections: string[];
  
  // Actions
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: Node<NodeData> | null) => void;
  
  setActiveTab: (tab: string) => void;
  setSimulationRunning: (running: boolean) => void;
  setShowSimulationModal: (show: boolean) => void;
  setSimulationResults: (results: any) => void;
  setShowAddComponentModal: (show: boolean) => void;
  setAddComponentType: (type: NodeType | null) => void;
  
  toggleSection: (section: string) => void;
  
  // Node operations
  addNode: (node: Omit<Node<NodeData>, 'id'>) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  
  // Simulation
  runSimulation: () => Promise<void>;
}

const initialNodes: Node<NodeData>[] = [
  {
    id: 'customer',
    type: 'actor',
    position: { x: 280, y: 160 },
    data: {
      name: 'Customer',
      description: 'Human Actor',
      actorType: 'human',
      icon: 'user',
      color: 'blue'
    }
  },
  {
    id: 'sales-agent',
    type: 'actor',
    position: { x: 520, y: 220 },
    data: {
      name: 'Sales Agent',
      description: 'AI Actor',
      actorType: 'agent',
      icon: 'robot',
      color: 'gray'
    }
  },
  {
    id: 'orchestrator',
    type: 'orchestrator',
    position: { x: 680, y: 320 },
    data: {
      name: 'Orchestrator',
      description: 'System',
      actorType: 'system',
      icon: 'cogs',
      color: 'gray'
    }
  },
  {
    id: 'outlook',
    type: 'tool',
    position: { x: 680, y: 80 },
    data: {
      name: 'Outlook',
      description: 'Email Tool',
      toolType: 'outlook',
      icon: 'envelope',
      color: 'blue'
    }
  },
  {
    id: 'calendar',
    type: 'tool',
    position: { x: 880, y: 130 },
    data: {
      name: 'Calendar',
      description: 'Scheduling Tool',
      toolType: 'calendar',
      icon: 'calendar',
      color: 'green'
    }
  },
  {
    id: 'salesforce',
    type: 'tool',
    position: { x: 480, y: 350 },
    data: {
      name: 'SalesForce',
      description: 'CRM Tool',
      toolType: 'salesforce',
      icon: 'cloud',
      color: 'green'
    }
  },
  {
    id: 'openai',
    type: 'tool',
    position: { x: 260, y: 320 },
    data: {
      name: 'OpenAI',
      description: 'LLM Provider',
      toolType: 'openai',
      icon: 'brain',
      color: 'gray'
    }
  },
  {
    id: 'sales-team',
    type: 'actor',
    position: { x: 920, y: 350 },
    data: {
      name: 'Sales Team',
      description: 'Human Group',
      actorType: 'human',
      icon: 'users',
      color: 'blue'
    }
  },
  {
    id: 'sales-manager',
    type: 'actor',
    position: { x: 860, y: 430 },
    data: {
      name: 'Sales Manager',
      description: 'Human Supervisor',
      actorType: 'human',
      icon: 'user-tie',
      color: 'blue'
    }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'customer', target: 'sales-agent' },
  { id: 'e2', source: 'sales-agent', target: 'orchestrator' },
  { id: 'e3', source: 'orchestrator', target: 'sales-manager' },
  { id: 'e4', source: 'orchestrator', target: 'sales-team' },
  { id: 'e5', source: 'outlook', target: 'sales-agent' },
  { id: 'e6', source: 'calendar', target: 'sales-agent' },
  { id: 'e7', source: 'salesforce', target: 'orchestrator' },
  { id: 'e8', source: 'openai', target: 'sales-agent' }
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Initial state
  nodes: initialNodes,
  edges: initialEdges,
  selectedNode: null,
  activeTab: 'actors',
  isSimulationRunning: false,
  showSimulationModal: false,
  simulationResults: null,
  showAddComponentModal: false,
  addComponentType: null,
  expandedSections: ['environments', 'agents'],
  
  // Canvas actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges)
    });
  },
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  // UI actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSimulationRunning: (running) => set({ isSimulationRunning: running }),
  setShowSimulationModal: (show) => set({ showSimulationModal: show }),
  setSimulationResults: (results) => set({ simulationResults: results }),
  setShowAddComponentModal: (show) => set({ showAddComponentModal: show }),
  setAddComponentType: (type) => set({ addComponentType: type }),
  
  toggleSection: (section) => {
    const { expandedSections } = get();
    const isExpanded = expandedSections.includes(section);
    set({
      expandedSections: isExpanded
        ? expandedSections.filter(s => s !== section)
        : [...expandedSections, section]
    });
  },
  
  // Node operations
  addNode: (nodeData) => {
    const newNode: Node<NodeData> = {
      id: `node-${Date.now()}`,
      ...nodeData
    };
    set({ nodes: [...get().nodes, newNode] });
  },
  
  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map(node =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    });
  },
  
  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter(node => node.id !== id),
      edges: get().edges.filter(edge => edge.source !== id && edge.target !== id)
    });
  },
  
  // Simulation
  runSimulation: async () => {
    set({ isSimulationRunning: true });
    
    try {
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        success: true,
        completionRate: 94,
        successRate: 87,
        duration: 5000,
        logs: [
          {
            id: 'log-1',
            timestamp: Date.now(),
            nodeId: 'customer',
            type: 'input',
            message: 'Customer initiated contact',
            data: { message: "Hi, I'm interested in your product demo." }
          },
          {
            id: 'log-2',
            timestamp: Date.now() + 2000,
            nodeId: 'sales-agent',
            type: 'output',
            message: 'Sales Agent responded',
            data: { message: "I'd be happy to help! Let me check our available demo slots." }
          }
        ]
      };
      
      set({ 
        simulationResults: mockResults,
        showSimulationModal: true 
      });
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      set({ isSimulationRunning: false });
    }
  }
}));
