import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useWorkflowStore } from '@/store/workflow-store';

export function PropertiesPanel() {
  const { selectedNode, updateNode } = useWorkflowStore();

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-500">Select a component to configure</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <p>No component selected</p>
        </div>
      </div>
    );
  }

  const handleUpdateNode = (field: string, value: any) => {
    updateNode(selectedNode.id, { [field]: value });
  };

  const isAgent = selectedNode.data.actorType === 'agent';

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Properties</h2>
        <p className="text-sm text-gray-500">Configure selected component</p>
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Node Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Node Information</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="name" className="text-xs font-medium text-gray-700">Name</Label>
              <Input
                id="name"
                value={selectedNode.data.name}
                onChange={(e) => handleUpdateNode('name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-xs font-medium text-gray-700">Type</Label>
              <Select
                value={selectedNode.data.actorType || selectedNode.type}
                onValueChange={(value) => handleUpdateNode('actorType', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">AI Agent</SelectItem>
                  <SelectItem value="human">Human Actor</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description" className="text-xs font-medium text-gray-700">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={selectedNode.data.description || ''}
                onChange={(e) => handleUpdateNode('description', e.target.value)}
                placeholder="Describe this component..."
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Agent Configuration */}
        {isAgent && (
          <>
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Agent Configuration</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-gray-700">LLM Provider</Label>
                  <Select defaultValue="openai-gpt4">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai-gpt4">OpenAI GPT-4</SelectItem>
                      <SelectItem value="anthropic-claude">Anthropic Claude</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-700">Temperature</Label>
                  <div className="mt-2">
                    <Slider
                      defaultValue={[0.7]}
                      max={1}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>0.7</span>
                      <span>1</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="maxTokens" className="text-xs font-medium text-gray-700">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    defaultValue={2048}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Tools Access */}
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Available Tools</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="salesforce" defaultChecked />
                  <Label htmlFor="salesforce" className="text-sm text-gray-700">SalesForce CRM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="calendar" defaultChecked />
                  <Label htmlFor="calendar" className="text-sm text-gray-700">Calendar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="outlook" />
                  <Label htmlFor="outlook" className="text-sm text-gray-700">Email (Outlook)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="docgen" />
                  <Label htmlFor="docgen" className="text-sm text-gray-700">Document Generation</Label>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <Separator />
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Success Rate</span>
                  <span className="text-sm font-semibold text-green-600">87.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Avg Response Time</span>
                  <span className="text-sm font-semibold text-gray-900">2.4s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Total Interactions</span>
                  <span className="text-sm font-semibold text-gray-900">1,247</span>
                </div>
                <Progress value={87} className="w-full" />
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <Separator />
        <div className="space-y-2 pt-4">
          <Button className="w-full">
            Save Configuration
          </Button>
          <Button variant="outline" className="w-full">
            Test Component
          </Button>
        </div>
      </div>
    </div>
  );
}
