import { create } from 'zustand';
import { Node, Edge, addEdge, applyNodeChanges, applyEdgeChanges, Connection } from 'reactflow';
import type { NodeData, SimulationMetrics, NodeType } from '@/types/workflow';

interface CanvasData {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

interface WorkflowState {
  // Canvas state - now per environment
  canvases: Record<string, CanvasData>;
  currentEnvironmentId: string;
  selectedNode: Node<NodeData> | null;
  
  // UI state
  activeTab: string;
  isSimulationRunning: boolean;
  showSimulationModal: boolean;
  simulationResults: any;
  showAddComponentModal: boolean;
  addComponentType: NodeType | null;
  
  // Retrain state
  isRetrainRunning: boolean;
  retrainAgentId: string | null;
  
  // Results state
  showResultsModal: boolean;
  resultsData: any;
  
  // Animation state
  simulationAnimations: {
    talkingBubbles: Set<string>;
    processingGears: Set<string>;
    highlightedEdges: Set<string>;
    retrainGears: Set<string>;
  };
  
  // Sidebar state
  expandedSections: string[];
  
  // Canvas actions
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: Node<NodeData> | null) => void;
  
  // Environment actions
  setCurrentEnvironment: (environmentId: string) => void;
  getCurrentCanvas: () => CanvasData;
  
  // Computed properties
  nodes: Node<NodeData>[];
  edges: Edge[];
  
  setActiveTab: (tab: string) => void;
  setSimulationRunning: (running: boolean) => void;
  setShowSimulationModal: (show: boolean) => void;
  setSimulationResults: (results: any) => void;
  setShowAddComponentModal: (show: boolean) => void;
  setAddComponentType: (type: NodeType | null) => void;
  
  // Retrain actions
  setRetrainRunning: (running: boolean) => void;
  setRetrainAgentId: (agentId: string | null) => void;
  runRetrain: (agentId: string, method: string, rewardId: string) => Promise<void>;
  
  // Results actions
  setShowResultsModal: (show: boolean) => void;
  setResultsData: (data: any) => void;
  
  // Animation actions
  addTalkingBubble: (nodeId: string) => void;
  removeTalkingBubble: (nodeId: string) => void;
  addProcessingGear: (nodeId: string) => void;
  removeProcessingGear: (nodeId: string) => void;
  addHighlightedEdge: (edgeId: string) => void;
  removeHighlightedEdge: (edgeId: string) => void;
  addRetrainGear: (nodeId: string) => void;
  removeRetrainGear: (nodeId: string) => void;
  clearAllAnimations: () => void;
  
  toggleSection: (section: string) => void;
  
  // Node operations
  addNode: (node: Omit<Node<NodeData>, 'id'>) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  deleteNode: (id: string) => void;
  
  // Simulation
  runSimulation: () => Promise<void>;
}

// Default canvas data for production environment
const productionCanvasData: CanvasData = {
  nodes: [
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
  ],
  edges: [
    { id: 'e1', source: 'customer', target: 'sales-agent' },
    { id: 'e2', source: 'sales-agent', target: 'orchestrator' },
    { id: 'e3', source: 'orchestrator', target: 'sales-manager' },
    { id: 'e4', source: 'orchestrator', target: 'sales-team' },
    { id: 'e5', source: 'outlook', target: 'sales-agent' },
    { id: 'e6', source: 'calendar', target: 'sales-agent' },
    { id: 'e7', source: 'salesforce', target: 'orchestrator' },
    { id: 'e8', source: 'openai', target: 'sales-agent' }
  ]
};

// Initialize canvases for different environments
// Note: These will be dynamically populated when environments are loaded
const initialCanvases: Record<string, CanvasData> = {};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Initial state
  canvases: initialCanvases,
  currentEnvironmentId: '',
  selectedNode: null,
  activeTab: 'actors',
  isSimulationRunning: false,
  showSimulationModal: false,
  simulationResults: null,
  showAddComponentModal: false,
  addComponentType: null,
  isRetrainRunning: false,
  retrainAgentId: null,
  showResultsModal: false,
  resultsData: null,
  simulationAnimations: {
    talkingBubbles: new Set(),
    processingGears: new Set(),
    highlightedEdges: new Set(),
    retrainGears: new Set(),
  },
  expandedSections: ['environments', 'agents'],
  
  // Computed properties
  get nodes() {
    const { canvases, currentEnvironmentId } = get();
    return canvases[currentEnvironmentId]?.nodes || [];
  },
  
  get edges() {
    const { canvases, currentEnvironmentId } = get();
    return canvases[currentEnvironmentId]?.edges || [];
  },
  
  // Canvas actions
  setNodes: (nodes) => {
    const { canvases, currentEnvironmentId } = get();
    set({
      canvases: {
        ...canvases,
        [currentEnvironmentId]: {
          ...canvases[currentEnvironmentId],
          nodes
        }
      }
    });
  },
  
  setEdges: (edges) => {
    const { canvases, currentEnvironmentId } = get();
    set({
      canvases: {
        ...canvases,
        [currentEnvironmentId]: {
          ...canvases[currentEnvironmentId],
          edges
        }
      }
    });
  },
  
  onNodesChange: (changes) => {
    const { canvases, currentEnvironmentId } = get();
    const currentCanvas = canvases[currentEnvironmentId];
    if (!currentCanvas) return;
    
    const updatedNodes = applyNodeChanges(changes, currentCanvas.nodes);
    set({
      canvases: {
        ...canvases,
        [currentEnvironmentId]: {
          ...currentCanvas,
          nodes: updatedNodes
        }
      }
    });
  },
  
  onEdgesChange: (changes) => {
    const { canvases, currentEnvironmentId } = get();
    const currentCanvas = canvases[currentEnvironmentId];
    if (!currentCanvas) return;
    
    const updatedEdges = applyEdgeChanges(changes, currentCanvas.edges);
    set({
      canvases: {
        ...canvases,
        [currentEnvironmentId]: {
          ...currentCanvas,
          edges: updatedEdges
        }
      }
    });
  },
  
  onConnect: (connection) => {
    const { canvases, currentEnvironmentId } = get();
    const currentCanvas = canvases[currentEnvironmentId];
    if (!currentCanvas) return;
    
    const updatedEdges = addEdge(connection, currentCanvas.edges);
    set({
      canvases: {
        ...canvases,
        [currentEnvironmentId]: {
          ...currentCanvas,
          edges: updatedEdges
        }
      }
    });
  },
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  // Environment actions
  setCurrentEnvironment: (environmentId) => {
    const { canvases } = get();
    // Initialize canvas if environment doesn't exist
    if (!canvases[environmentId]) {
      // For the first environment (typically production), use demo data
      const isFirstEnvironment = Object.keys(canvases).length === 0;
      const canvasData = isFirstEnvironment ? productionCanvasData : { nodes: [], edges: [] };
      
      set({
        canvases: {
          ...canvases,
          [environmentId]: canvasData
        },
        currentEnvironmentId: environmentId,
        selectedNode: null // Clear selection when switching environments
      });
    } else {
      set({ 
        currentEnvironmentId: environmentId,
        selectedNode: null // Clear selection when switching environments
      });
    }
  },
  
  getCurrentCanvas: () => {
    const { canvases, currentEnvironmentId } = get();
    return canvases[currentEnvironmentId] || { nodes: [], edges: [] };
  },
  
  // UI actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSimulationRunning: (running) => set({ isSimulationRunning: running }),
  setShowSimulationModal: (show) => set({ showSimulationModal: show }),
  setSimulationResults: (results) => set({ simulationResults: results }),
  setShowAddComponentModal: (show) => set({ showAddComponentModal: show }),
  setAddComponentType: (type) => set({ addComponentType: type }),
  
  // Retrain actions
  setRetrainRunning: (running) => set({ isRetrainRunning: running }),
  setRetrainAgentId: (agentId) => set({ retrainAgentId: agentId }),
  
  runRetrain: async (agentId, method, rewardId) => {
    const { addRetrainGear, removeRetrainGear, setShowResultsModal, setResultsData } = get();
    
    set({ isRetrainRunning: true, retrainAgentId: agentId });
    addRetrainGear(agentId);
    
    try {
      // Simulate retrain process
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Generate results data
      const resultsData = {
        agentId,
        method,
        rewardId,
        completedAt: new Date(),
        improvements: [
          { metric: 'Success Rate', before: 87, after: 94 },
          { metric: 'Response Time', before: 2400, after: 1800 },
          { metric: 'Completion Rate', before: 92, after: 96 },
          { metric: 'Error Rate', before: 8.5, after: 3.2 }
        ]
      };
      
      setResultsData(resultsData);
      console.log(`Retrain completed for agent ${agentId} using ${method} with reward ${rewardId}`);
      
      // Show results modal after a brief delay
      setTimeout(() => {
        setShowResultsModal(true);
      }, 500);
      
    } catch (error) {
      console.error('Retrain failed:', error);
    } finally {
      removeRetrainGear(agentId);
      set({ isRetrainRunning: false, retrainAgentId: null });
    }
  },
  
  // Results actions
  setShowResultsModal: (show) => set({ showResultsModal: show }),
  setResultsData: (data) => set({ resultsData: data }),
  
  // Animation actions
  addTalkingBubble: (nodeId) => {
    const { simulationAnimations } = get();
    const newBubbles = new Set(simulationAnimations.talkingBubbles);
    newBubbles.add(nodeId);
    set({
      simulationAnimations: {
        ...simulationAnimations,
        talkingBubbles: newBubbles
      }
    });
  },
  
  removeTalkingBubble: (nodeId) => {
    const { simulationAnimations } = get();
    const newBubbles = new Set(simulationAnimations.talkingBubbles);
    newBubbles.delete(nodeId);
    set({
      simulationAnimations: {
        ...simulationAnimations,
        talkingBubbles: newBubbles
      }
    });
  },
  
  addProcessingGear: (nodeId) => {
    const { simulationAnimations } = get();
    const newGears = new Set(simulationAnimations.processingGears);
    newGears.add(nodeId);
    set({
      simulationAnimations: {
        ...simulationAnimations,
        processingGears: newGears
      }
    });
  },
  
  removeProcessingGear: (nodeId) => {
    const { simulationAnimations } = get();
    const newGears = new Set(simulationAnimations.processingGears);
    newGears.delete(nodeId);
    set({
      simulationAnimations: {
        ...simulationAnimations,
        processingGears: newGears
      }
    });
  },
  
  addHighlightedEdge: (edgeId) => {
    const { simulationAnimations } = get();
    const newEdges = new Set(simulationAnimations.highlightedEdges);
    newEdges.add(edgeId);
    set({
      simulationAnimations: {
        ...simulationAnimations,
        highlightedEdges: newEdges
      }
    });
  },
  
  removeHighlightedEdge: (edgeId) => {
    const { simulationAnimations } = get();
    const newEdges = new Set(simulationAnimations.highlightedEdges);
    newEdges.delete(edgeId);
    set({
      simulationAnimations: {
        ...simulationAnimations,
        highlightedEdges: newEdges
      }
    });
  },
  
  addRetrainGear: (nodeId) => {
    const { simulationAnimations } = get();
    const newGears = new Set(simulationAnimations.retrainGears);
    newGears.add(nodeId);
    set({
      simulationAnimations: {
        ...simulationAnimations,
        retrainGears: newGears
      }
    });
  },
  
  removeRetrainGear: (nodeId) => {
    const { simulationAnimations } = get();
    const newGears = new Set(simulationAnimations.retrainGears);
    newGears.delete(nodeId);
    set({
      simulationAnimations: {
        ...simulationAnimations,
        retrainGears: newGears
      }
    });
  },

  clearAllAnimations: () => {
    set({
      simulationAnimations: {
        talkingBubbles: new Set(),
        processingGears: new Set(),
        highlightedEdges: new Set(),
        retrainGears: new Set(),
      }
    });
  },
  
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
    const { canvases, currentEnvironmentId } = get();
    const currentCanvas = canvases[currentEnvironmentId];
    if (!currentCanvas) return;
    
    const newNode: Node<NodeData> = {
      id: `node-${Date.now()}`,
      ...nodeData
    };
    
    set({
      canvases: {
        ...canvases,
        [currentEnvironmentId]: {
          ...currentCanvas,
          nodes: [...currentCanvas.nodes, newNode]
        }
      }
    });
  },
  
  updateNode: (id, data) => {
    const { canvases, currentEnvironmentId } = get();
    const currentCanvas = canvases[currentEnvironmentId];
    if (!currentCanvas) return;
    
    const updatedNodes = currentCanvas.nodes.map(node =>
      node.id === id ? { ...node, data: { ...node.data, ...data } } : node
    );
    
    set({
      canvases: {
        ...canvases,
        [currentEnvironmentId]: {
          ...currentCanvas,
          nodes: updatedNodes
        }
      }
    });
  },
  
  deleteNode: (id) => {
    const { canvases, currentEnvironmentId } = get();
    const currentCanvas = canvases[currentEnvironmentId];
    if (!currentCanvas) return;
    
    set({
      canvases: {
        ...canvases,
        [currentEnvironmentId]: {
          nodes: currentCanvas.nodes.filter(node => node.id !== id),
          edges: currentCanvas.edges.filter(edge => edge.source !== id && edge.target !== id)
        }
      }
    });
  },
  
  // Simulation
  runSimulation: async () => {
    const { getCurrentCanvas, addTalkingBubble, removeTalkingBubble, addProcessingGear, removeProcessingGear, addHighlightedEdge, removeHighlightedEdge, clearAllAnimations } = get();
    const { nodes, edges } = getCurrentCanvas();
    
    set({ isSimulationRunning: true });
    clearAllAnimations();
    
    try {
      // Create animation timeline for 5 seconds
      const actorNodes = nodes.filter(node => node.type === 'actor');
      const toolNodes = nodes.filter(node => node.type === 'tool');
      const availableEdges = edges.map(edge => edge.id);
      
      // Random animation scheduler
      const animationIntervals: NodeJS.Timeout[] = [];
      
      // Schedule random talking bubbles for actors
      for (let i = 0; i < 8; i++) {
        const timeout = setTimeout(() => {
          if (actorNodes.length > 0) {
            const randomActor = actorNodes[Math.floor(Math.random() * actorNodes.length)];
            addTalkingBubble(randomActor.id);
            
            // Remove bubble after 1-2 seconds
            setTimeout(() => {
              removeTalkingBubble(randomActor.id);
            }, 1000 + Math.random() * 1000);
          }
        }, Math.random() * 4500);
        animationIntervals.push(timeout);
      }
      
      // Schedule random processing gears for tools
      for (let i = 0; i < 6; i++) {
        const timeout = setTimeout(() => {
          if (toolNodes.length > 0) {
            const randomTool = toolNodes[Math.floor(Math.random() * toolNodes.length)];
            addProcessingGear(randomTool.id);
            
            // Remove gear after 1.5-2.5 seconds
            setTimeout(() => {
              removeProcessingGear(randomTool.id);
            }, 1500 + Math.random() * 1000);
          }
        }, Math.random() * 4500);
        animationIntervals.push(timeout);
      }
      
      // Schedule random edge highlights
      for (let i = 0; i < 10; i++) {
        const timeout = setTimeout(() => {
          if (availableEdges.length > 0) {
            const randomEdge = availableEdges[Math.floor(Math.random() * availableEdges.length)];
            addHighlightedEdge(randomEdge);
            
            // Remove highlight after 0.8-1.5 seconds
            setTimeout(() => {
              removeHighlightedEdge(randomEdge);
            }, 800 + Math.random() * 700);
          }
        }, Math.random() * 4500);
        animationIntervals.push(timeout);
      }
      
      // Wait for 5 seconds simulation duration
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Clear all intervals
      animationIntervals.forEach(interval => clearTimeout(interval));
      
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
      clearAllAnimations();
      set({ isSimulationRunning: false });
    }
  }
}));
