import { Sidebar } from '@/components/sidebar';
import { TopToolbar } from '@/components/top-toolbar';
import { CanvasArea } from '@/components/canvas-area';
import { PropertiesPanel } from '@/components/properties-panel';
import { SimulationModal } from '@/components/simulation-modal';

export default function WorkflowDesigner() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopToolbar />
        <CanvasArea />
      </div>
      
      <PropertiesPanel />
      <SimulationModal />
    </div>
  );
}
