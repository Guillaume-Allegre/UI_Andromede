import { useState } from 'react';
import { Box, Layers, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CreateEnvironmentModal } from '@/components/create-environment-modal';
import { type Environment } from '@shared/schema';

export function Sidebar() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEnvironmentsExpanded, setIsEnvironmentsExpanded] = useState(true);

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
      <div className="border-b border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start p-4 h-auto rounded-none hover:bg-gray-50"
          onClick={() => setIsEnvironmentsExpanded(!isEnvironmentsExpanded)}
        >
          <div className="flex items-center space-x-2 w-full">
            {isEnvironmentsExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">Environments</span>
          </div>
        </Button>
        
        {isEnvironmentsExpanded && (
          <div className="pb-4">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-1">
                {environments.map((env) => (
                  <Button
                    key={env.id}
                    variant={selectedEnvironment === env.id ? "secondary" : "ghost"}
                    className="w-full justify-start px-6 py-2 h-auto rounded-none text-left"
                    onClick={() => setSelectedEnvironment(env.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{env.name}</span>
                      {env.description && (
                        <span className="text-xs text-gray-500 mt-1">{env.description}</span>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content area for future features */}
      <div className="flex-1 p-4">
        <div className="text-sm text-gray-500 text-center">
          {selectedEnvironment 
            ? `Working in ${environments.find(env => env.id === selectedEnvironment)?.name || 'Selected Environment'}`
            : 'Select an environment to get started'
          }
        </div>
      </div>

      {/* Create Environment Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          className="w-full"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Environment
        </Button>
      </div>

      <CreateEnvironmentModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
