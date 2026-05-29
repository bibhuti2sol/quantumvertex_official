import type { Metadata } from 'next';
import TaskManagementInteractive from './components/TaskManagementInteractive';

export const metadata: Metadata = {
  title: 'Task Management - NextGenTaskManager',
  description:
    'Comprehensive task creation, organization, and tracking with multiple view modes including List, Kanban, and Focus views. Manage priorities, deadlines, and team collaboration efficiently.',
};

export default function TaskManagementPage() {
  return <TaskManagementInteractive />;
}
