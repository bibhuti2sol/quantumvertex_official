'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import axios from 'axios';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';
import { TaskComment } from './types';

interface TaskCommentsModalProps {
  taskId: string;
  taskTitle: string;
  onClose: () => void;
}

const TaskCommentsModal = ({ taskId, taskTitle, onClose }: TaskCommentsModalProps) => {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(API_ENDPOINTS.tasks.comments(taskId), {
        headers: { Authorization: token },
      });
      if (Array.isArray(response.data)) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('TaskCommentsModal: Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const token = getAuthToken();
      await axios.post(
        API_ENDPOINTS.tasks.comments(taskId),
        { content: newComment },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('TaskCommentsModal: Error posting comment:', error);
      alert('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[2100] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[2101] p-4 pointer-events-none">
        <div className="bg-card w-full max-w-lg rounded-2xl shadow-elevation-3 overflow-hidden flex flex-col max-h-[80vh] pointer-events-auto animate-fade-in border border-border">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">Task Comments</h3>
              <p className="font-caption text-xs text-muted-foreground truncate max-w-[250px]">
                {taskTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-smooth"
            >
              <Icon
                name="XMarkIcon"
                size={20}
                variant="outline"
                className="text-muted-foreground"
              />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-caption text-sm text-muted-foreground">Loading comments...</p>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <span className="text-xs font-bold text-primary">
                      {(comment.authorName || comment.userName || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-caption font-bold text-sm text-foreground">
                        {comment.authorName || comment.userName || 'Unknown User'}
                      </h4>
                      <span className="font-caption text-[10px] text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-muted/40 rounded-2xl rounded-tl-none p-3 border border-border/50 shadow-sm">
                      <p className="font-caption text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Icon name="ChatBubbleLeftIcon" size={32} className="text-muted-foreground/40" />
                </div>
                <p className="font-caption text-sm text-muted-foreground">No comments yet.</p>
                <p className="font-caption text-xs text-muted-foreground mt-1">
                  Be the first to share an update!
                </p>
              </div>
            )}
          </div>

          {/* New Comment Input */}
          <div className="p-4 border-t border-border bg-muted/10">
            <form onSubmit={handleAddComment} className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] max-h-[150px] resize-none transition-smooth"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon name="PaperAirplaneIcon" size={16} variant="outline" />
                )}
              </button>
            </form>
            <p className="font-caption text-[10px] text-muted-foreground mt-2 px-1 text-center">
              Press Enter to post, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCommentsModal;
