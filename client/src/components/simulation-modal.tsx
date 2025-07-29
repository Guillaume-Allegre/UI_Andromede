import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWorkflowStore } from '@/store/workflow-store';

export function SimulationModal() {
  const { 
    showSimulationModal, 
    setShowSimulationModal, 
    simulationResults,
    isSimulationRunning 
  } = useWorkflowStore();

  const handleClose = () => {
    setShowSimulationModal(false);
  };

  return (
    <Dialog open={showSimulationModal} onOpenChange={setShowSimulationModal}>
      <DialogContent className="max-w-4xl h-3/4 flex flex-col p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b">
          <DialogTitle>Simulation Results</DialogTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex">
          {/* Logs Section */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isSimulationRunning ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Running simulation...</p>
                </div>
              </div>
            ) : simulationResults ? (
              <div className="space-y-4">
                {simulationResults.logs?.map((log: any, index: number) => (
                  <div key={log.id} className={`rounded-lg p-4 ${
                    log.type === 'input' ? 'bg-gray-50' : 'bg-blue-50'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        log.type === 'input' ? 'bg-green-500' : 'bg-primary'
                      }`} />
                      <span className="text-sm font-medium text-gray-900">
                        {log.message}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {log.data?.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No simulation data available
              </div>
            )}
          </div>
          
          {/* Metrics Section */}
          <div className="w-80 border-l border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Metrics</h3>
            
            {simulationResults && !isSimulationRunning && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Completion</span>
                    <span className="text-sm font-semibold">
                      {simulationResults.completionRate}%
                    </span>
                  </div>
                  <Progress value={simulationResults.completionRate} className="w-full" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">Success Rate</span>
                    <span className="text-sm font-semibold text-green-600">
                      {simulationResults.successRate}%
                    </span>
                  </div>
                  <Progress value={simulationResults.successRate} className="w-full" />
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Duration</span>
                      <Badge variant="secondary">{simulationResults.duration}ms</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge variant={simulationResults.success ? "default" : "destructive"}>
                        {simulationResults.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isSimulationRunning && (
              <div className="text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
