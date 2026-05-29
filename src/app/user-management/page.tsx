import type { Metadata } from 'next';
import UserManagementInteractive from './components/UserManagementInteractive';

export const metadata: Metadata = {
  title: 'User Management - NextGenTaskManager',
  description:
    'Manage organizational users, teams, and hierarchical structures with comprehensive administrative tools for user provisioning, role assignment, and team allocation.',
};

export default function UserManagementPage() {
  return <UserManagementInteractive />;
}
