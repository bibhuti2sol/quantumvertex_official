import type { Metadata } from 'next';
import UserProfileSettingsInteractive from './components/UserProfileSettingsInteractive';

export const metadata: Metadata = {
  title: 'User Profile Settings - NextGenTaskManager',
  description:
    'Manage your account settings, notification preferences, security options, and personalization settings for NextGenTaskManager.',
};

export default function UserProfileSettingsPage() {
  return <UserProfileSettingsInteractive />;
}
