import type { Metadata } from 'next';
import LoginInteractive from './components/LoginInteractive';
import PublicFooter from '@/components/layout/PublicFooter';

export const metadata: Metadata = {
  title: 'Login - NextGenTask Manager',
  description:
    'Sign in to NextGenTask Manager to access your task management workspace with role-based access control for administrators, managers, and associates.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <LoginInteractive />
      </div>
      <PublicFooter />
    </div>
  );
}
