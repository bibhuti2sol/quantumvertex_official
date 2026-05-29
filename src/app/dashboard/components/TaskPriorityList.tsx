// import Icon from '@/components/ui/AppIcon';

interface Task {
  id: number;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Pending' | 'Completed';
  deadline: string;
  assignee: string;
}

interface TaskPriorityListProps {
  tasks: Task[];
  onStatusChange?: (taskId: number, newStatus: string) => void;
}

const TaskPriorityList = ({ tasks, onStatusChange }: TaskPriorityListProps) => {
  const priorityColors = {
    High: 'bg-error/10 text-error border-error/20',
    Medium: 'bg-warning/10 text-warning border-warning/20',
    Low: 'bg-success/10 text-success border-success/20',
  };

  const statusColors = {
    'In Progress': 'bg-primary text-primary-foreground',
    Pending: 'bg-muted text-muted-foreground',
    Completed: 'bg-success text-success-foreground',
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-base text-foreground mb-2">
                {task.title}
              </h4>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-caption font-medium border ${priorityColors[task.priority]}`}
                >
                  {task.priority}
                </span>
                <span
                  className={`px-3 py-1 rounded-md text-xs font-caption font-medium ${statusColors[task.status]}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-caption">{task.deadline}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-caption">{task.assignee}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskPriorityList;
