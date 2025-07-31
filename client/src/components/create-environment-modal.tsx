import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertEnvironmentSchema, type InsertEnvironment } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CreateEnvironmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEnvironmentModal({ isOpen, onClose }: CreateEnvironmentModalProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<InsertEnvironment>({
    resolver: zodResolver(insertEnvironmentSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createEnvironmentMutation = useMutation({
    mutationFn: (data: InsertEnvironment) => 
      apiRequest('POST', '/api/environments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/environments'] });
      toast({
        title: 'Environment created',
        description: 'Your new environment has been created successfully.',
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'Failed to create environment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: InsertEnvironment) => {
    createEnvironmentMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Environment</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter environment name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    A unique name for your environment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter environment description"
                      rows={3}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the purpose and use case for this environment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={createEnvironmentMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createEnvironmentMutation.isPending}
              >
                {createEnvironmentMutation.isPending ? 'Creating...' : 'Create Environment'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}