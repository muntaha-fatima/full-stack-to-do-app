/**
 * Collaboration page - Manage task assignments and comments.
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getTaskAssignments,
  updateTaskAssignment,
  getTaskComments,
  createTaskComment
} from '@/lib/collaboration';
import {
  TaskAssignment,
  TaskAssignmentUpdate,
  TaskAssignmentListResponse,
  TaskCommentCreate,
  TaskCommentListResponse
} from '@/types/collaboration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/protected-route';
import {
  UserPlusIcon,
  MessageCircleIcon,
  CheckIcon,
  XIcon,
  CalendarIcon
} from 'lucide-react';

// Note: Textarea is not available in the UI components, so we'll use a regular textarea

export default function CollaborationPage() {
  const [newComment, setNewComment] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch task assignments
  const { data: assignments, isLoading: assignmentsLoading, error: assignmentsError } = useQuery<TaskAssignmentListResponse>({
    queryKey: ['collaboration', 'assignments'],
    queryFn: () => getTaskAssignments(1, 50),
  });

  // Fetch comments for a specific task if selected
  const { data: comments, isLoading: commentsLoading } = useQuery<TaskCommentListResponse>({
    queryKey: ['collaboration', 'comments', selectedTaskId],
    queryFn: () => selectedTaskId ? getTaskComments(selectedTaskId, 1, 50) : Promise.resolve({ data: [], meta: { page: 1, per_page: 20, total: 0, total_pages: 0 } }),
    enabled: !!selectedTaskId,
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: createTaskComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaboration', 'comments', selectedTaskId] });
      setNewComment('');
      toast.success('Comment added successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to add comment: ${error.message}`);
    },
  });

  // Update assignment mutation
  const updateAssignmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskAssignmentUpdate }) =>
      updateTaskAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaboration', 'assignments'] });
      toast.success('Assignment updated successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to update assignment: ${error.message}`);
    },
  });

  const handleAddComment = () => {
    if (!selectedTaskId || !newComment.trim()) return;

    const commentData: TaskCommentCreate = {
      task_id: selectedTaskId,
      content: newComment.trim(),
    };

    createCommentMutation.mutate(commentData);
  };

  const handleUpdateAssignment = (id: number, status: 'accepted' | 'declined' | 'completed') => {
    const updateData: TaskAssignmentUpdate = { status };
    updateAssignmentMutation.mutate({ id, data: updateData });
  };

  const handleAssignmentClick = (assignment: TaskAssignment) => {
    setSelectedTaskId(assignment.task_id);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <main className="lg:pl-64">
          <div className="p-4 lg:p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Collaboration</h1>
              <p className="text-muted-foreground">
                Manage task assignments and collaborate with others
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlusIcon className="h-5 w-5 mr-2" />
                    Task Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignmentsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : assignmentsError ? (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                      <p className="text-destructive">Error loading assignments: {(assignmentsError as Error).message}</p>
                    </div>
                  ) : assignments && assignments.data.length > 0 ? (
                    <div className="space-y-4">
                      {assignments.data.map((assignment) => (
                        <div
                          key={assignment.id}
                          className={`p-4 border rounded-lg ${
                            selectedTaskId === assignment.task_id ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Task #{assignment.task_id}</h3>
                              <div className="flex items-center mt-1 space-x-2">
                                <Badge
                                  variant={
                                    assignment.status === 'accepted' ? 'default' :
                                    assignment.status === 'pending' ? 'secondary' :
                                    assignment.status === 'completed' ? 'success' : 'destructive'
                                  }
                                >
                                  {assignment.status}
                                </Badge>
                                {assignment.due_date && (
                                  <span className="text-xs flex items-center text-muted-foreground">
                                    <CalendarIcon className="h-3 w-3 mr-1" />
                                    {new Date(assignment.due_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {assignment.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateAssignment(assignment.id, 'accepted')}
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateAssignment(assignment.id, 'declined')}
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {assignment.status === 'accepted' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateAssignment(assignment.id, 'completed')}
                                >
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 w-full justify-start"
                            onClick={() => handleAssignmentClick(assignment)}
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No task assignments found
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Task Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircleIcon className="h-5 w-5 mr-2" />
                    Task Comments
                    {selectedTaskId && <span className="ml-2 text-sm font-normal">(Task #{selectedTaskId})</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTaskId ? (
                    <>
                      <div className="mb-4">
                        <div className="flex space-x-2">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            disabled={createCommentMutation.isPending}
                            className="flex-1 p-2 border rounded-md min-h-[40px]"
                          />
                          <Button
                            onClick={handleAddComment}
                            disabled={createCommentMutation.isPending || !newComment.trim()}
                          >
                            Post
                          </Button>
                        </div>
                      </div>

                      {commentsLoading ? (
                        <div className="flex justify-center items-center h-16">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      ) : comments && comments.data.length > 0 ? (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {comments.data.map((comment) => (
                            <div key={comment.id} className="p-3 border rounded-md">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">User #{comment.author_id}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="mt-2 text-sm">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No comments for this task yet
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Select a task assignment to view or add comments
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}