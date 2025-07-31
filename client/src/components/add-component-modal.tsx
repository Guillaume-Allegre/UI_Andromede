import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkflowStore } from '@/store/workflow-store';
import { Node } from 'reactflow';
import type { NodeData, NodeType } from '@/types/workflow';

interface AddComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentType: NodeType;
}

const componentTypeLabels = {
  actor: 'Actor',
  tool: 'Tool',
  orchestrator: 'Orchestrator',
  trigger: 'Trigger',
  reward: 'Reward'
};

const getTypeOptions = (componentType: NodeType) => {
  switch (componentType) {
    case 'actor':
      return [
        { value: 'human', label: 'Human Actor' },
        { value: 'agent', label: 'AI Agent' },
        { value: 'system', label: 'System' }
      ];
    case 'tool':
      return [
        { value: 'api', label: 'API Tool' },
        { value: 'database', label: 'Database Tool' },
        { value: 'external', label: 'External Service' }
      ];
    case 'orchestrator':
      return [
        { value: 'workflow', label: 'Workflow Orchestrator' },
        { value: 'decision', label: 'Decision Engine' },
        { value: 'routing', label: 'Routing Logic' }
      ];
    case 'trigger':
      return [
        { value: 'event', label: 'Event Trigger' },
        { value: 'schedule', label: 'Scheduled Trigger' },
        { value: 'webhook', label: 'Webhook Trigger' }
      ];
    case 'reward':
      return [
        { value: 'completion', label: 'Completion Reward' },
        { value: 'performance', label: 'Performance Reward' },
        { value: 'outcome', label: 'Outcome Reward' }
      ];
    default:
      return [];
  }
};

const getDefaultIcon = (componentType: NodeType, subType?: string) => {
  switch (componentType) {
    case 'actor':
      return subType === 'agent' ? 'robot' : subType === 'system' ? 'cogs' : 'user';
    case 'tool':
      return 'wrench';
    case 'orchestrator':
      return 'cogs';
    case 'trigger':
      return 'zap';
    case 'reward':
      return 'trophy';
    default:
      return 'circle';
  }
};

const getDefaultColor = (componentType: NodeType) => {
  switch (componentType) {
    case 'actor':
      return 'blue';
    case 'tool':
      return 'green';
    case 'orchestrator':
      return 'gray';
    case 'trigger':
      return 'yellow';
    case 'reward':
      return 'purple';
    default:
      return 'gray';
  }
};

export function AddComponentModal({ isOpen, onClose, componentType }: AddComponentModalProps) {
  const { addNode, nodes } = useWorkflowStore();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    apiEndpoint: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    console.log('Component type:', componentType);
    
    if (!formData.name || !formData.type) {
      console.log('Validation failed - missing name or type');
      return; // Basic validation
    }

    // Calculate position for new node (avoid overlapping)
    const nodeCount = nodes.length;
    const baseX = 200;
    const baseY = 100;
    const offsetX = (nodeCount % 4) * 250;
    const offsetY = Math.floor(nodeCount / 4) * 150;

    const nodeData: NodeData = {
      name: formData.name,
      description: formData.description,
      config: {
        apiEndpoint: formData.apiEndpoint
      },
      icon: getDefaultIcon(componentType, formData.type),
      color: getDefaultColor(componentType)
    };

    // Add specific type field based on component type
    if (componentType === 'actor') {
      nodeData.actorType = formData.type as 'human' | 'agent' | 'system';
    } else if (componentType === 'tool') {
      nodeData.toolType = formData.type;
    }

    const newNode: Omit<Node<NodeData>, 'id'> = {
      type: componentType,
      position: { 
        x: baseX + offsetX, 
        y: baseY + offsetY 
      },
      data: nodeData
    };

    console.log('About to add node:', newNode);
    addNode(newNode);
    console.log('Node added successfully');

    // Reset form and close modal
    setFormData({
      name: '',
      type: '',
      apiEndpoint: '',
      description: ''
    });
    onClose();
  };

  const typeOptions = getTypeOptions(componentType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New {componentTypeLabels[componentType]}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={`Enter ${componentTypeLabels[componentType].toLowerCase()} name`}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="type" className="text-sm font-medium">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="apiEndpoint" className="text-sm font-medium">API Endpoint</Label>
            <Input
              id="apiEndpoint"
              value={formData.apiEndpoint}
              onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
              placeholder="https://api.example.com/endpoint"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={`Describe this ${componentTypeLabels[componentType].toLowerCase()}...`}
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.type}>
              Add {componentTypeLabels[componentType]}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}