import type { Metadata } from 'next';
import ProjectOverviewInteractive from './components/ProjectOverviewInteractive';

export const metadata: Metadata = {
  title: 'Project Overview - NextGenTaskManager',
  description:
    'Comprehensive project tracking with Gantt charts, timeline views, and critical path analysis for effective project management with AI-powered insights.',
};

export default function ProjectOverviewPage() {
  return <ProjectOverviewInteractive />;
}
