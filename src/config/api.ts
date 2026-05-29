/**
 * ============================================================
 *  CENTRALIZED API CONFIGURATION
 *  src/config/api.ts
 * ============================================================
 *
 *  ✅ This is the SINGLE SOURCE OF TRUTH for all backend URLs.
 *
 *  To change the backend (e.g., staging → production):
 *    → Update NEXT_PUBLIC_API_BASE_URL in .env.local ONLY.
 *    → No other file needs to be touched.
 *
 *  Usage in components:
 *    import { API_ENDPOINTS, apiClient } from '@/config/api';
 *
 *    // Get a URL:
 *    const url = API_ENDPOINTS.tasks.list();
 *    const url = API_ENDPOINTS.tasks.byId(42);
 *
 *    // Make an authenticated request:
 *    const res = await apiClient.get(API_ENDPOINTS.projects.list());
 * ============================================================
 */

import axios from 'axios';
import { getAuthToken } from '@/utils/auth';

// ─── Base URL ────────────────────────────────────────────────
// Reads from .env.local → NEXT_PUBLIC_API_BASE_URL
// Falls back to the current server if the env variable is missing.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://www.nextgentask.co.in/api/v1';

// ─── Endpoint Builders ───────────────────────────────────────
export const API_ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────────────
  auth: {
    signin: () => `${API_BASE_URL}/auth/signin`,
    signup: () => `${API_BASE_URL}/auth/signup`,
    forgotPassword: () => `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: () => `${API_BASE_URL}/auth/reset-password`,
  },

  // ── Users ─────────────────────────────────────────────────
  users: {
    list: () => `${API_BASE_URL}/users`,
    byId: (id: number | string) => `${API_BASE_URL}/users/${id}`,
    create: () => `${API_BASE_URL}/users`,
    assignees: () => `${API_BASE_URL}/users/assignees`,
    assigneesDropdown: () => `${API_BASE_URL}/users/assignees/dropdown`,
    updateCapacity: () => `${API_BASE_URL}/users/assignee/capacity`,
    profile: () => `${API_BASE_URL}/users/profile/me`,
    profilePicture: () => `${API_BASE_URL}/users/profile/me/profile-pictures`,
    getProfilePicture: (id: number | string) =>
      `${API_BASE_URL}/users/profile/${id}/profile-pictures`,
    changePassword: (id: number | string) => `${API_BASE_URL}/users/${id}/change-password`,
  },

  // ── Projects ──────────────────────────────────────────────
  projects: {
    list: () => `${API_BASE_URL}/projects`,
    byId: (id: number | string) => `${API_BASE_URL}/projects/${id}`,
    create: () => `${API_BASE_URL}/projects`,
    export: (format: string, search = '', status = '', priority = '', type = '', managerId = '') =>
      `${API_BASE_URL}/projects/export?format=${format}&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&priority=${encodeURIComponent(priority)}&type=${encodeURIComponent(type)}&managerId=${encodeURIComponent(managerId)}`,
    dropdown: () => `${API_BASE_URL}/projects/dropdown`,
  },

  // ── Tasks ─────────────────────────────────────────────────
  tasks: {
    list: () => `${API_BASE_URL}/tasks`,
    byId: (id: number | string) => `${API_BASE_URL}/tasks/${id}`,
    create: () => `${API_BASE_URL}/tasks`,
    comments: (taskId: number | string) => `${API_BASE_URL}/tasks/${taskId}/comments`,
    export: (
      format: string,
      search = '',
      status = '',
      priority = '',
      assigneeId = '',
      projectId = ''
    ) =>
      `${API_BASE_URL}/tasks/export?format=${format}&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&priority=${encodeURIComponent(priority)}&assigneeId=${encodeURIComponent(assigneeId)}&projectId=${encodeURIComponent(projectId)}`,
    byIdComment: (taskId: number | string, commentId: number | string) =>
      `${API_BASE_URL}/tasks/${taskId}/comments/${commentId}`,
  },

  // ── Subtasks ──────────────────────────────────────────────
  subtasks: {
    list: (taskId: number | string) => `${API_BASE_URL}/tasks/${taskId}/subtasks`,
    byId: (taskId: number | string, subtaskId: number | string) =>
      `${API_BASE_URL}/tasks/${taskId}/subtasks/${subtaskId}`,
    create: (taskId: number | string) => `${API_BASE_URL}/tasks/${taskId}/subtasks`,
  },

  // ── Teams ─────────────────────────────────────────────────
  teams: {
    list: () => `${API_BASE_URL}/teams`,
    byId: (id: number | string) => `${API_BASE_URL}/teams/${id}`,
    create: () => `${API_BASE_URL}/teams`,
    eligibleLeads: () => `${API_BASE_URL}/teams/leads/eligible`,
    byDepartment: (deptId: number | string) => `${API_BASE_URL}/teams/department/${deptId}`,
    workload: () => `${API_BASE_URL}/teams/workload`,
  },

  // ── Departments ───────────────────────────────────────────
  departments: {
    list: () => `${API_BASE_URL}/departments`,
    byId: (id: number | string) => `${API_BASE_URL}/departments/${id}`,
    create: () => `${API_BASE_URL}/departments`,
    eligibleHeads: () => `${API_BASE_URL}/departments/heads/eligible`,
    dropdown: () => `${API_BASE_URL}/departments/dropdown`,
  },

  // ── Resource Allocation ───────────────────────────────────
  resourceAllocation: {
    list: () => `${API_BASE_URL}/resource-allocation`,
    update: () => `${API_BASE_URL}/resource-allocation`,
  },

  // ── Resources (alias for ResourceAllocation) ──────────────
  resources: {
    list: () => `${API_BASE_URL}/resource-allocation`,
  },

  // ── Dashboard / Analytics ─────────────────────────────────
  dashboard: {
    summary: () => `${API_BASE_URL}/dashboard`,
    byProject: (projectId: number | string) => `${API_BASE_URL}/dashboard?projectId=${projectId}`,
  },
};

// ─── Pre-configured Axios Client ─────────────────────────────
// Auth header is injected automatically on every request.
// Import `apiClient` and use it instead of bare `axios` or `fetch`.
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});
