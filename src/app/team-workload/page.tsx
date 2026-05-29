import type { Metadata } from 'next';
import TeamWorkloadInteractive from './components/TeamWorkloadInteractive';

export const metadata: Metadata = {
  title: 'Team Workload - NextGenTaskManager',
  description:
    'Visualize team capacity, distribute tasks effectively, and monitor productivity across all team members with AI-powered workload balancing and real-time analytics.',
};

export default function TeamWorkloadPage() {
  return <TeamWorkloadInteractive />;
}
