import { Play, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/store/workflow-store';
import type { NodeType } from '@/types/workflow';

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
    setAddComponentType
  } = useWorkflowStore();

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.id);
    setAddComponentType(tab.nodeType);
    setShowAddComponentModal(true);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Tabs */}
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabClick(tab)}
              className={activeTab === tab.id ? "bg-primary/10 text-primary" : ""}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={runSimulation}
            disabled={isSimulationRunning}
          >
            <Play className="w-4 h-4 mr-2" />
            {isSimulationRunning ? 'Running...' : 'Run Simulation'}
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Scenario
          </Button>
        </div>
      </div>
    </div>
  );
}
