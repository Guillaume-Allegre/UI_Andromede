import { Sidebar } from '@/components/sidebar';
import { TopToolbar } from '@/components/top-toolbar';
import { CanvasArea } from '@/components/canvas-area';
import { PropertiesPanel } from '@/components/properties-panel';
import { SimulationModal } from '@/components/simulation-modal';
import { ResultsModal } from '@/components/results-modal';
import { AddComponentModal } from '@/components/add-component-modal';
import { useWorkflowStore } from '@/store/workflow-store';

export default function WorkflowDesigner() {
  const { 
    showAddComponentModal, 
    setShowAddComponentModal, 
    addComponentType,
    selectedNode
  } = useWorkflowStore();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopToolbar />
        <CanvasArea />
      </div>
      
      {selectedNode && <PropertiesPanel />}
      <SimulationModal />
      <ResultsModal />
      <AddComponentModal 
        isOpen={showAddComponentModal}
        onClose={() => setShowAddComponentModal(false)}
        componentType={addComponentType || 'actor'}
      />
    </div>
  );
}
