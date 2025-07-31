import { X, TrendingUp, CheckCircle, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflowStore } from '@/store/workflow-store';

interface PerformanceImprovement {
  metric: string;
  before: number;
  after: number;
  unit: string;
  improvement: number;
  isPositive: boolean;
}

interface UpdateHighlight {
  component: string;
  type: 'agent' | 'model' | 'parameter';
  change: string;
  impact: 'high' | 'medium' | 'low';
}

export function ResultsModal() {
  const { 
    showResultsModal, 
    setShowResultsModal, 
    resultsData 
  } = useWorkflowStore();

  const handleClose = () => {
    setShowResultsModal(false);
  };

  // Mock performance improvements - in real app this would come from actual training results
  const performanceImprovements: PerformanceImprovement[] = [
    {
      metric: 'Success Rate',
      before: 87,
      after: 94,
      unit: '%',
      improvement: 8.0,
      isPositive: true
    },
    {
      metric: 'Response Time',
      before: 2400,
      after: 1800,
      unit: 'ms',
      improvement: 25.0,
      isPositive: true
    },
    {
      metric: 'Completion Rate',
      before: 92,
      after: 96,
      unit: '%',
      improvement: 4.3,
      isPositive: true
    },
    {
      metric: 'Error Rate',
      before: 8.5,
      after: 3.2,
      unit: '%',
      improvement: 62.4,
      isPositive: true
    }
  ];

  // Mock update highlights - in real app this would track actual model changes
  const updateHighlights: UpdateHighlight[] = [
    {
      component: 'Sales Agent',
      type: 'agent',
      change: 'Updated conversation flow for better customer engagement',
      impact: 'high'
    },
    {
      component: 'GPT-4 Model',
      type: 'model',
      change: 'Fine-tuned with domain-specific sales conversations',
      impact: 'high'
    },
    {
      component: 'Temperature',
      type: 'parameter',
      change: 'Optimized from 0.7 to 0.6 for more consistent responses',
      impact: 'medium'
    },
    {
      component: 'Response Length',
      type: 'parameter',
      change: 'Adjusted max tokens to improve response conciseness',
      impact: 'medium'
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'agent': return '🤖';
      case 'model': return '🧠';
      case 'parameter': return '⚙️';
      default: return '📊';
    }
  };

  return (
    <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b">
          <div>
            <DialogTitle className="text-2xl">Training Results</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Performance improvements and model updates</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex">
          {/* Performance Metrics Section */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              
              {/* Overall Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Performance Overview
                  </CardTitle>
                  <CardDescription>
                    Training completed successfully with significant improvements across all metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {performanceImprovements.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                          <div className="flex items-center gap-1">
                            {metric.isPositive ? (
                              <ArrowUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm font-semibold ${
                              metric.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                              +{metric.improvement.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Before: {metric.before}{metric.unit}</span>
                              <span>After: {metric.after}{metric.unit}</span>
                            </div>
                            <Progress 
                              value={metric.metric === 'Error Rate' ? 100 - metric.after : metric.after} 
                              className="h-2" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Training Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Training Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Training Duration</span>
                      <Badge variant="secondary">5.2 seconds</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Training Method</span>
                      <Badge variant="outline">Reinforcement Learning</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Reward Signal</span>
                      <Badge variant="outline">Customer Satisfaction</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Updates & Changes Section */}
          <div className="w-96 border-l border-gray-200 p-6 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-4">What Was Updated</h3>
            
            <div className="space-y-4">
              {updateHighlights.map((update, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{getTypeIcon(update.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm text-gray-900">
                            {update.component}
                          </h4>
                          <Badge 
                            variant="secondary" 
                            className={getImpactColor(update.impact)}
                          >
                            {update.impact} impact
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {update.change}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button className="w-full" size="sm">
                Deploy Updated Model
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Export Training Report
              </Button>
              <Button variant="ghost" className="w-full" size="sm">
                View Detailed Logs
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}