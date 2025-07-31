import { useState } from 'react';
import { Box, Layers, ChevronDown, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateEnvironmentModal } from '@/components/create-environment-modal';
import { type Environment } from '@shared/schema';

export function Sidebar() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: environments = [], isLoading } = useQuery<Environment[]>({
    queryKey: ['/api/environments'],
  });

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Project Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Box className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Helix</h1>
            <p className="text-xs text-gray-500">AI Agent Platform</p>
          </div>
        </div>
      </div>

      {/* Environments Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">Environments</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-6 h-6 p-0"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
        
        <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoading ? "Loading..." : "Select environment"} />
          </SelectTrigger>
          <SelectContent>
            {environments.map((env) => (
              <SelectItem key={env.id} value={env.id}>
                {env.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedEnvironment && (
          <div className="mt-2 text-xs text-gray-500">
            {environments.find(env => env.id === selectedEnvironment)?.description}
          </div>
        )}
      </div>

      {/* Content area for future features */}
      <div className="flex-1 p-4">
        <div className="text-sm text-gray-500 text-center">
          Select an environment to get started
        </div>
      </div>

      <CreateEnvironmentModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
