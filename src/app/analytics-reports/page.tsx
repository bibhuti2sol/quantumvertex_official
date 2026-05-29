import type { Metadata } from 'next';
import AnalyticsInteractive from './components/AnalyticsInteractive';

export const metadata: Metadata = {
  title: 'Analytics Reports - NextGenTaskManager',
  description:
    'Comprehensive productivity insights, performance metrics, and automated report generation for data-driven decision making with AI-powered predictive analytics.',
};

export default function AnalyticsReportsPage() {
  return <AnalyticsInteractive />;
}
