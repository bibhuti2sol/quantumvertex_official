interface Project {
  id: number;
  name: string;
  healthScore: number;
  tasksCompleted: number;
  totalTasks: number;
  status: 'On Track' | 'At Risk' | 'Delayed';
}

interface ProjectHealthCardProps {
  projects: Project[];
}

const ProjectHealthCard = ({ projects }: ProjectHealthCardProps) => {
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-success/10 text-success border-success/20';
      case 'At Risk':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Delayed':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-heading font-semibold text-base text-foreground mb-2">
                {project.name}
              </h4>
              <span
                className={`px-3 py-1 rounded-md text-xs font-caption font-medium border ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
            <div className="text-right">
              <p
                className={`font-heading font-bold text-2xl ${getHealthColor(project.healthScore)}`}
              >
                {project.healthScore}
              </p>
              <p className="text-xs font-caption text-muted-foreground">Health Score</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-caption text-muted-foreground">Progress</span>
              <span className="font-caption font-medium text-foreground">
                {project.tasksCompleted}/{project.totalTasks} tasks
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-smooth"
                style={{ width: `${(project.tasksCompleted / project.totalTasks) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectHealthCard;
