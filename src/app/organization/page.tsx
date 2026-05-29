import type { Metadata } from 'next';
import OrganizationInteractive from './components/OrganizationInteractive';

export const metadata: Metadata = {
  title: 'Organization - NextGenTaskManager',
  description:
    'View organization chart hierarchy, track company revenue milestones, and manage employee career progression targets.',
};

export default function OrganizationPage() {
  return <OrganizationInteractive />;
}
