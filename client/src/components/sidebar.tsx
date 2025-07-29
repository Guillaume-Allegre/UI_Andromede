import { 
  Box, 
  Layers, 
  PlayCircle, 
  Wrench, 
  History, 
  BarChart3, 
  Bot, 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  Cog, 
  Search, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/store/workflow-store';

export function Sidebar() {
  const { expandedSections, toggleSection } = useWorkflowStore();

  const isExpanded = (section: string) => expandedSections.includes(section);

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

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Environments Section */}
        <div className="mb-4">
          <div 
            className="flex items-center justify-between px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => toggleSection('environments')}
          >
            <div className="flex items-center space-x-2">
              {isExpanded('environments') ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <Layers className="w-4 h-4 text-primary" />
              <span>Environments</span>
            </div>
            <Button variant="ghost" size="sm" className="w-4 h-4 p-0">
              <Plus className="w-3 h-3 text-gray-400" />
            </Button>
          </div>
          
          {isExpanded('environments') && (
            <div className="ml-6 mt-1 space-y-1">
              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                <PlayCircle className="w-4 h-4 text-primary" />
                <span>Scenarios</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                <Wrench className="w-4 h-4 text-green-500" />
                <span>Tools</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                <History className="w-4 h-4 text-yellow-500" />
                <span>Runs</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span>Dashboard</span>
              </div>
            </div>
          )}
        </div>

        {/* Agents Section */}
        <div className="mb-4">
          <div 
            className="flex items-center justify-between px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => toggleSection('agents')}
          >
            <div className="flex items-center space-x-2">
              {isExpanded('agents') ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <Bot className="w-4 h-4 text-primary" />
              <span>Agents</span>
            </div>
            <Button variant="ghost" size="sm" className="w-4 h-4 p-0">
              <Plus className="w-3 h-3 text-gray-400" />
            </Button>
          </div>
          
          {isExpanded('agents') && (
            <div className="ml-6 mt-1 space-y-1">
              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-primary bg-primary/10 rounded cursor-pointer">
                <Brain className="w-4 h-4" />
                <span>SalesGPT</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span>ConfiAI</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                <TrendingUp className="w-4 h-4" />
                <span>Generics</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                <Cog className="w-4 h-4" />
                <span>Test</span>
              </div>
              <div className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded cursor-pointer">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </div>
          )}
        </div>

        {/* Smart Lens Section */}
        <div className="px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded cursor-pointer">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-primary" />
            <span>Smart Lens</span>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full flex items-center space-x-2 justify-start px-2 py-2 text-sm text-gray-600"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
}
