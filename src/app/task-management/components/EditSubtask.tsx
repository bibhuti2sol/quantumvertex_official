import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Subtask } from './types';
import { getAuthToken } from '@/utils/auth';
import { API_ENDPOINTS } from '@/config/api';

interface EditSubtaskProps {
  taskId: string;
  subtask: Subtask;
  onSave: (updated: Subtask) => void;
  onClose: () => void;
}

const EditSubtask = ({ taskId, subtask, onSave, onClose }: EditSubtaskProps) => {
  const [title, setTitle] = useState(subtask?.title || '');
  const [description, setDescription] = useState(subtask?.description || '');
  const [status, setStatus] = useState<Subtask['status']>(subtask?.status || 'To Do');
  const [assignee, setAssignee] = useState(subtask?.assignee || '');
  const [startDate, setStartDate] = useState(subtask?.startDate || '');
  const [endDate, setEndDate] = useState(subtask?.endDate || '');
  const [submitting, setSubmitting] = useState(false);
  const [assignees, setAssignees] = useState<{ id: number; fullName: string }[]>([]);
  const [loadingAssignees, setLoadingAssignees] = useState(false);

  useEffect(() => {
    const fetchAssignees = async () => {
      setLoadingAssignees(true);
      try {
        const token = getAuthToken();
        const response = await axios.get(API_ENDPOINTS.users.assignees(), {
          headers: { Authorization: token },
        });
        setAssignees(response.data);
      } catch (error) {
        console.error('Error fetching assignees:', error);
      } finally {
        setLoadingAssignees(false);
      }
    };
    fetchAssignees();
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Subtask Name is required.');
      return;
    }
    if (!status) {
      alert('Status is required.');
      return;
    }
    if (!assignee) {
      alert('Assignee is required.');
      return;
    }
    if (!startDate) {
      alert('Start Date is required.');
      return;
    }
    if (!endDate) {
      alert('End Date is required.');
      return;
    }
    setSubmitting(true);

    try {
      const token = getAuthToken();

      const statusMap: Record<string, string> = {
        'To Do': 'TODO',
        'In Progress': 'IN_PROGRESS',
        Review: 'REVIEW',
        Completed: 'DONE',
      };

      const selectedAssignee = assignees.find((a) => a.fullName === assignee);
      const assigneeId = selectedAssignee ? selectedAssignee.id : subtask.assigneeId || null;

      const payload = {
        name: title,
        description: description,
        status: statusMap[status] || 'TODO',
        assigneeId: assigneeId,
        startDate: startDate || null,
        endDate: endDate || null,
      };

      const url = subtask.id
        ? API_ENDPOINTS.subtasks.byId(taskId, subtask.id)
        : API_ENDPOINTS.subtasks.create(taskId);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      };

      const response = subtask.id
        ? await axios.put(url, payload, config)
        : await axios.post(url, payload, config);

      if (response.status === 200 || response.status === 201) {
        const savedSubtask = response.data;
        onSave({
          id: savedSubtask.id || subtask.id,
          title,
          description,
          status,
          assignee,
          assigneeId: assigneeId ?? undefined,
          startDate,
          endDate,
        });
        onClose();
      }
    } catch (error) {
      console.error('Error saving subtask:', error);
      alert('Failed to save subtask. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in pointer-events-auto">
        <button
          className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-primary mb-4 text-center">
          {subtask.id ? 'Edit Subtask' : 'Add Subtask'}
        </h3>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Subtask Name <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Subtask Name"
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-smooth"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              rows={3}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-smooth resize-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Status <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Subtask['status'])}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
              required
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Assignee <span className="text-red-500 font-bold">*</span>
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              disabled={loadingAssignees}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground disabled:opacity-50"
              required
            >
              <option value="">
                {loadingAssignees ? 'Loading assignees...' : 'Select Assignee'}
              </option>
              {assignees.map((a) => (
                <option key={a.id} value={a.fullName}>
                  {a.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Start Date <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              End Date <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-border rounded-lg px-4 py-2 w-full bg-background text-foreground"
              required
            />
          </div>
          <button
            type="button"
            disabled={submitting}
            className="mt-2 bg-success text-white font-bold px-6 py-2 rounded-lg hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={handleSave}
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubtask;
