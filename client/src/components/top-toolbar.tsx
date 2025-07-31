import { Play, Save, Plus, ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWorkflowStore } from '@/store/workflow-store';
import type { NodeType } from '@/types/workflow';
import { useState } from 'react';

const tabs = [
  { id: 'actors', label: 'Actors', nodeType: 'actor' as NodeType },
  { id: 'tools', label: 'Tools', nodeType: 'tool' as NodeType },
  { id: 'triggers', label: 'Triggers', nodeType: 'trigger' as NodeType },
  { id: 'rewards', label: 'Rewards', nodeType: 'reward' as NodeType },
  { id: 'scenarios', label: 'Scenarios', nodeType: 'orchestrator' as NodeType },
];

export function TopToolbar() {
  const { 
    activeTab, 
    setActiveTab, 
    runSimulation, 
    isSimulationRunning,
    setShowAddComponentModal,
    setAddComponentType,
    nodes,
    runRetrain
  } = useWorkflowStore();

  const [showRetrainDialog, setShowRetrainDialog] = useState(false);
  const [selectedRetrainMethod, setSelectedRetrainMethod] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedReward, setSelectedReward] = useState('');

  const handleTabClick = (tab: typeof tabs[0]) => {
    console.log('Tab clicked:', tab);
    setActiveTab(tab.id);
    setAddComponentType(tab.nodeType);
    setShowAddComponentModal(true);
    console.log('Modal should now be shown');
  };

  // Get agents and rewards from current nodes
  const agents = nodes.filter(node => node.type === 'actor' && node.data.actorType === 'agent');
  const rewards = nodes.filter(node => node.type === 'reward');

  const retrainMethods = [
    { value: 'reinforcement', label: 'Reinforcement Learning' },
    { value: 'supervised', label: 'Supervised Learning' },
    { value: 'transfer', label: 'Transfer Learning' },
    { value: 'federated', label: 'Federated Learning' }
  ];

  const handleRetrain = async () => {
    if (selectedRetrainMethod && selectedAgent && selectedReward) {
      setShowRetrainDialog(false);
      await runRetrain(selectedAgent, selectedRetrainMethod, selectedReward);
      // Reset form
      setSelectedRetrainMethod('');
      setSelectedAgent('');
      setSelectedReward('');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - empty for now */}
        <div></div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Add Components Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Component
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline" 
            size="sm"
            onClick={runSimulation}
            disabled={isSimulationRunning}
          >
            <Play className="w-4 h-4 mr-2" />
            {isSimulationRunning ? 'Running...' : 'Run Evaluation'}
          </Button>

          {/* Retrain Dialog */}
          <Dialog open={showRetrainDialog} onOpenChange={setShowRetrainDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retrain
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Retrain Agent</DialogTitle>
                <DialogDescription>
                  Select the retrain method, agent, and reward to use for retraining.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="retrain-method" className="text-sm font-medium">
                    Retrain Method
                  </label>
                  <Select value={selectedRetrainMethod} onValueChange={setSelectedRetrainMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select retrain method" />
                    </SelectTrigger>
                    <SelectContent>
                      {retrainMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="agent" className="text-sm font-medium">
                    Agent to Retrain
                  </label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.data.name}
                        </SelectItem>
                      ))}
                      {agents.length === 0 && (
                        <SelectItem value="no-agents" disabled>
                          No agents available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="reward" className="text-sm font-medium">
                    Reward to Use
                  </label>
                  <Select value={selectedReward} onValueChange={setSelectedReward}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reward" />
                    </SelectTrigger>
                    <SelectContent>
                      {rewards.map((reward) => (
                        <SelectItem key={reward.id} value={reward.id}>
                          {reward.data.name}
                        </SelectItem>
                      ))}
                      {rewards.length === 0 && (
                        <SelectItem value="no-rewards" disabled>
                          No rewards available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowRetrainDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRetrain}
                  disabled={!selectedRetrainMethod || !selectedAgent || !selectedReward}
                >
                  Start Retrain
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Models
          </Button>
        </div>
      </div>
    </div>
  );
}
