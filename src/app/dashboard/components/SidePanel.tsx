import Icon from '@/components/ui/AppIcon';

// Removed dynamic count rendering logic from the side panel
const SidePanel = () => {
  return (
    <div className="side-panel">
      <ul>
        <li className="flex items-center gap-2">
          <Icon name="DashboardIcon" />
          <span>Dashboard</span>
        </li>
        <li className="flex items-center gap-2">
          <Icon name="UserManagementIcon" />
          <span>User Management</span>
        </li>
        <li className="flex items-center gap-2">
          <Icon name="ProjectsIcon" />
          <span>Projects</span>
        </li>
        <li className="flex items-center gap-2">
          <Icon name="TasksIcon" />
          <span>Tasks</span>
        </li>
        <li className="flex items-center gap-2">
          <Icon name="TeamIcon" />
          <span>Team</span>
        </li>
        <li className="flex items-center gap-2">
          <Icon name="AnalyticsIcon" />
          <span>Analytics</span>
        </li>
        <li className="flex items-center gap-2">
          <Icon name="ProfileIcon" />
          <span>Profile</span>
        </li>
      </ul>
    </div>
  );
};

export default SidePanel;
