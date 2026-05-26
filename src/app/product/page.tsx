import React from "react";
import ProductLogo from "../../components/ProductLogo";
import InteractiveChart from "../../components/InteractiveChart";
import ActionableFlow from "../../components/ActionableFlow";

export default function ProductPage() {
  return (
    <main style={{ background: "#fbfdff", minHeight: "100vh", paddingTop: "5.5rem" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Theme + prose styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root{
            --accent-cyan:#06b6d4;
            --text-primary:#0f172a;
            --text-secondary:#374151;
            --muted:#6b7280;
            --card-bg:#ffffff;
          }
          .prose-container{ max-width:65ch; margin:0 auto; color:var(--text-secondary); font-family: 'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; line-height:1.8 }
          .prose-container h1{ color:var(--text-primary); font-size:2.25rem; margin-bottom:0.5rem }
          .prose-container h2{ color:var(--text-primary); font-size:1.25rem; margin-top:1.6rem; margin-bottom:0.6rem }
          .prose-container h3{ color:var(--text-primary); font-size:1.05rem; margin-top:1rem; margin-bottom:0.5rem }
          .prose-container p{ margin-bottom:0.9rem }
          .prose-container a{ color:var(--accent-cyan); text-decoration:underline }
          .prose-container code{ background:rgba(15,23,42,0.04); padding:0.12rem 0.36rem; border-radius:6px }
          .prose-container pre{ background:rgba(2,6,23,0.03); padding:0.75rem; border-radius:8px; overflow:auto }
          h2,h3{ scroll-margin-top:5.5rem }
          .toc-grid{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1rem }
          .toc-grid ol{ margin:0 }

          /* Action box styles (zig-zag) */
          .action-box{ position:relative; background:var(--card-bg); border-radius:12px; padding:18px; margin-bottom:1.75rem; box-shadow:0 6px 18px rgba(16,24,40,0.04); transition: transform .15s ease, box-shadow .15s ease }
          /* base width for zig-zag columns */
          .action-box{ width:70%; }
          .action-box[data-side="left"]{ margin-left:0; margin-right:auto; border-left:4px solid var(--accent-cyan); border-right:none; }
          .action-box[data-side="right"]{ margin-left:auto; margin-right:0; border-right:4px solid var(--accent-cyan); border-left:none; }
          .action-box:hover{ transform:translateY(-6px); box-shadow:0 18px 50px rgba(16,24,40,0.06) }

          .action-controls{ position:absolute; right:16px; top:16px; display:flex; gap:8px; align-items:center }
          .action-box[data-side="right"] .action-controls{ left:16px; right:auto }
          .action-controls a{ padding:6px 10px; border-radius:8px; background:#f3f4f6; color:var(--text-primary); font-weight:600; text-decoration:none; font-size:0.85rem }
          .action-controls a.secondary{ background:transparent; border:1px solid rgba(15,23,42,0.04) }

          /* responsive: stack and full-width on small screens */
          @media (max-width:1024px){ .action-box{ width:88% } }
          @media (max-width:768px){ .toc-grid{ grid-template-columns:1fr } .prose-container{ padding:0 1rem } .action-controls{ position:static; margin-top:8px }
            .action-box{ padding:14px; width:100%; margin-left:auto; margin-right:auto; border-left:4px solid var(--accent-cyan); border-right:none }
            .action-box[data-side="right"]{ border-left:4px solid var(--accent-cyan); border-right:none }
          }
        ` }} />

        <div className="prose-container">
          <header className="mb-6 flex items-center gap-4">
            <ProductLogo className="h-16 md:h-20 object-contain" />
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  background: 'linear-gradient(90deg, #06b6d4, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '-0.01em'
                }}>
                  Welcome to the NextGen Task Manager!
                </h2>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '1.05rem' }}>
                  This manual provides step-by-step guidance on how to navigate, operate, and utilize all key functional modules within the application.
                </p>
              </div>
               <p style={{ color: 'var(--muted)' }}>
                 Product page: <a href="https://nextgentask.co.in" target="_blank" rel="noreferrer">https://nextgentask.co.in</a>
               </p>
             </div>
           </header>

          <section id="about" className="mb-6 action-box" data-side="left">
            <div className="action-controls">
              <a href="/product#about" className="">Open</a>
              <a href="#about" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 10, height: 34, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>About NextGenTask Manager</span>
            </h2>
            <p>NextGen Task Manager is a comprehensive, enterprise-grade project and task management solution built to streamline organizational workflows. By bridging the gap between high-level strategic planning and day-to-day execution, NextGen provides a centralized hub where teams can collaborate, track progress, and achieve their goals with maximum efficiency.</p>

            <p>Whether you are managing complex multi-team projects, tracking individual assignments via a Kanban board, or analyzing organizational workload through visual analytics, NextGen Task Manager equips you with an intuitive, responsive, and highly customizable interface. Key capabilities include robust role-based access control, deep hierarchical organization (departments and teams), seamless cross-functional reporting, and dynamic task lifecycle tracking.</p>

            <p>Designed for scalability and user satisfaction, NextGen Task Manager transforms chaos into structured, actionable intelligence—empowering your workforce to focus on what truly matters: delivering exceptional results.</p>

            <h3 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>Role-Based Access &amp; Privileges</span>
            </h3>
            <p>Security and operational hierarchy are core to NextGen Task Manager. The system employs strict Role-Based Access Control (RBAC) to ensure users only interact with data and features appropriate to their organizational standing. The three primary roles are:</p>
            <ul>
              <li><strong>Admin:</strong> The highest level of access. Admins have complete control over the system, including the ability to manage all users, oversee global organizational settings, assign roles, and access sensitive profile data (such as Date of Joining, Employee IDs, and Reporting chains). Admins can view, edit, and delete any project, task, or team across the entire organization.</li>
              <li><strong>Manager:</strong> Designed for team leaders and department heads. Managers possess elevated privileges to oversee their specific projects and direct reports. They can create tasks, assign work to associates, view team workloads, and manage project milestones. While they have broad operational control within their domains, they cannot modify critical global system settings or sensitive employee profile configurations.</li>
              <li><strong>Associate:</strong> The foundational role for individual contributors. Associates are granted focused access to execute their day-to-day responsibilities. They can view projects they are assigned to, update task statuses on the Kanban board, log activity, and manage their basic personal profile data. Associates are restricted from administrative actions such as altering deadlines or reassigning tasks to others.</li>
            </ul>
          </section>

          <section id="toc" className="mb-6">
            <h2>Table of Contents</h2>
            <div className="toc-grid mb-4">
              <ol className="list-decimal list-inside">
                <li><a href="#landing">Landing Page &amp; Authentication</a></li>
                <li><a href="#dashboard">Unified Command Center: Dashboard</a></li>
                <li><a href="#user-management">User &amp; Organizational Directory Management</a></li>
                <li><a href="#projects">Project &amp; Milestone Management</a></li>
                <li><a href="#tasks">Task &amp; Subtask Lifecycle Management</a></li>
                <li><a href="#kanban">Interactive Kanban Board</a></li>
              </ol>

              <ol start={7} className="list-decimal list-inside">
                <li><a href="#focus">Focus Mode Panel</a></li>
                <li><a href="#resource">Resource Allocation &amp; Team Workload</a></li>
                <li><a href="#analytics">Enterprise Analytics &amp; Visual BI</a></li>
                <li><a href="#settings">Personal Settings &amp; Profile Customization</a></li>
                <li><a href="#cleanup">Data Cleanup: Safe Deletion Workflows</a></li>
                <li><a href="#faq">Frequently Asked Questions (FAQ)</a></li>
              </ol>
            </div>
          </section>

          <article id="landing" className="mb-6 action-box" data-side="right">
            <div className="action-controls">
              <a href="/product#landing" className="">Open</a>
              <a href="#landing" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>1. Landing Page &amp; Authentication</span>
            </h2>
            <h3>A. Navigating the Public Space</h3>
            <p>The public space of NextGen Task Manager consists of three core pages:</p>
            <ul>
              <li><strong>Product Page (Landing):</strong> Highlighting core marketing assets, dark/light compatibility, sleek gradients, and responsiveness.</li>
              <li><strong>Signup Page:</strong> Allows new users to easily register by entering their details.</li>
              <li><strong>Login Page:</strong> Secured gate where registered users can input their email and password.</li>
            </ul>

            <h3>B. Standard Login Workflow</h3>
            <ol>
              <li>Direct your browser to the NextGen Task Manager web application.</li>
              <li>Click <strong>Login</strong> on the top navigation header.</li>
              <li>Input the following standard administrative/manager credentials:
                <ul>
                  <li><code>Email Address:</code> joy@yopmail.com</li>
                  <li><code>Password:</code> tesXXXXX</li>
                </ul>
              </li>
              <li>Toggle the <strong>Theme Selector</strong> at the top right to choose between Dark/Light mode before logging in, if desired.</li>
              <li>Click the secure <strong>Login</strong> button.</li>
            </ol>
          </article>

          <article id="dashboard" className="mb-6 action-box" data-side="left">
            <div className="action-controls">
              <a href="/product#dashboard" className="">Open</a>
              <a href="#dashboard" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>2. Unified Command Center: Dashboard</span>
            </h2>
            <p>Once logged in, you will be greeted by the <strong>Dashboard</strong>, the central control hub of the application.</p>
            <h3>A. Core Features &amp; Metrics</h3>
            <ul>
              <li><strong>Active Summaries:</strong> Live indicators showing <em>Total Projects</em>, <em>Active Tasks</em>, <em>Assigned Members</em>, and <em>Budget Burn</em> status.</li>
              <li><strong>Dynamic Project Filtering:</strong> Locate the project dropdown filter at the top of the dashboard. Changing the selected project dynamically updates all downstream task counts, completion percentages, and visual workload distributions in real-time.</li>
              <li><strong>Quick-Access Navigation Sidebar:</strong> Use the left collapsible sidebar to jump to all functional tabs, such as Tasks, Kanban, Analytics, Team, User Management, and Settings.</li>
            </ul>
            {/* Interactive chart: actionable analytics summary */}
            <InteractiveChart />
            <p>The dashboard supports dynamic filtering and quick actions for most entities.</p>
          </article>

          <article id="user-management" className="mb-6 action-box" data-side="right">
            <div className="action-controls">
              <a href="/product#user-management" className="">Open</a>
              <a href="#user-management" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>3. User &amp; Organizational Directory Management</span>
            </h2>
            <p>Manage your company structure securely using the <strong>User Management</strong> portal (available to Administrators and Managers).</p>

            <h3>A. Create a Department</h3>
            <ol>
              <li>Navigate to <strong>User Management</strong> in the left sidebar.</li>
              <li>Select the <strong>Departments</strong> tab at the top.</li>
              <li>Click the <strong>Add Department</strong> button and input a unique <em>Department Name</em>, select the <em>Department Head</em>, add a brief description, set the status to <em>Active</em>, and click <strong>Add Department</strong>.</li>
            </ol>

            <h3>B. Create a Team</h3>
            <ol>
              <li>Click the <strong>Teams</strong> tab under <strong>User Management</strong>.</li>
              <li>Click the <strong>Add Team</strong> button and choose a <em>Team Name</em>, parent <em>Department</em>, assign a <em>Team Lead</em>, set initial status and description, then click <strong>Create Team</strong>.</li>
            </ol>

            <h3>C. Create a User</h3>
            <ol>
              <li>Click the <strong>Users</strong> tab and choose <strong>Add User</strong>.</li>
              <li>Input first and last name, email, job title, role, department and team, then click <strong>Save</strong>.</li>
            </ol>
          </article>

          <article id="projects" className="mb-6 action-box" data-side="left">
            <div className="action-controls">
              <a href="/product#projects" className="">Open</a>
              <a href="#projects" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>4. Project &amp; Milestone Management</span>
            </h2>
            <h3>A. Create a Project</h3>
            <ol>
              <li>Navigate to <strong>Projects</strong> and click <strong>Create Project</strong>.</li>
              <li>Fill in <em>Project Name</em>, <em>Description</em>, <em>Total Budget</em>, assign a <em>Project Manager</em>, select start/end dates and priority, then click <strong>Create Project</strong>.</li>
            </ol>
            <h3>C. Milestone Tracking</h3>
            <p>Under each project's details you will find the <strong>Milestone Progress Tracker</strong> showing major phase gates.</p>
          </article>

          <article id="tasks" className="mb-6 action-box" data-side="right">
            <div className="action-controls">
              <a href="/product#tasks" className="">Open</a>
              <a href="#tasks" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>5. Task &amp; Subtask Lifecycle Management</span>
            </h2>
            <p>The granular level of daily operations is executed via the <strong>Task Management</strong> panel.</p>

            {/* Actionable flowchart for task lifecycle */}
            <ActionableFlow />
            <div className="overflow-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th className="text-left py-2">Action</th>
                    <th className="text-left py-2">Target</th>
                    <th className="text-left py-2">Fields Required</th>
                    <th className="text-left py-2">Key Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Create Task</td>
                    <td>Parent Project</td>
                    <td>Title, Description, Priority, Assignee, Status, Dates</td>
                    <td>Automatically adds the task to both the list and Kanban board.</td>
                  </tr>
                  <tr>
                    <td className="py-2">Edit Task</td>
                    <td>Active Task</td>
                    <td>Status, Assignee, Priority, Description</td>
                    <td>Live-syncs updates across all views immediately.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article id="kanban" className="mb-6 action-box" data-side="left">
            <div className="action-controls">
              <a href="/product#kanban" className="">Open</a>
              <a href="#kanban" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>6. Interactive Kanban Board</span>
            </h2>
            <ol>
              <li>Navigate to the <strong>Kanban Board</strong> tab on the sidebar.</li>
              <li>The board is divided into four columns: <strong>TODO</strong>, <strong>IN_PROGRESS</strong>, <strong>REVIEW</strong>, and <strong>DONE</strong>.</li>
              <li>Drag &amp; drop task cards between columns. Drops trigger a secure update to the server to persist state.</li>
            </ol>
          </article>

          <article id="focus" className="mb-6 action-box" data-side="right">
            <div className="action-controls">
              <a href="/product#focus" className="">Open</a>
              <a href="#focus" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>7. Focus Mode Panel</span>
            </h2>
            <ol>
              <li>Select <strong>Focus</strong> from the navigation sidebar.</li>
              <li>Create subtasks inline and check them off as you complete them to maintain peak daily velocity.</li>
            </ol>
          </article>

          <article id="resource" className="mb-6 action-box" data-side="left">
            <div className="action-controls">
              <a href="/product#resource" className="">Open</a>
              <a href="#resource" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>8. Resource Allocation &amp; Team Workload</span>
            </h2>
            <h3>A. Team Capacity Dashboard</h3>
            <p>Use filters to select Departments and Teams. The page displays capacity index, current tasks and average completion times.</p>
          </article>

          <article id="analytics" className="mb-6 action-box" data-side="right">
            <div className="action-controls">
              <a href="/product#analytics" className="">Open</a>
              <a href="#analytics" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>9. Enterprise Analytics &amp; Visual BI</span>
            </h2>
            <ul>
              <li>Project Budget Analysis</li>
              <li>Resource Utilization Heatmap</li>
              <li>Project Performance Overview</li>
            </ul>
          </article>

          <article id="settings" className="mb-6 action-box" data-side="left">
            <div className="action-controls">
              <a href="/product#settings" className="">Open</a>
              <a href="#settings" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>10. Personal Settings &amp; Profile Customization (Detailed)</span>
            </h2>
            <h3>A. Editing Profile Information</h3>
            <ol>
              <li>Navigate to <strong>Account Settings</strong> &gt; <strong>Profile</strong> and update your details.</li>
              <li>Upload a profile picture (png/jpg/jpeg) and click <strong>Save Changes</strong>.</li>
            </ol>

            <h3>B. Configuring Account Security &amp; Changing Password</h3>
            <ol>
              <li>Click <strong>Security</strong> in Account Settings and follow the Change Password workflow to update your password.</li>
              <li>Enable Two-Factor Authentication (2FA) to secure your account via an authenticator app.</li>
            </ol>
          </article>

          <article id="cleanup" className="mb-6 action-box" data-side="right">
            <div className="action-controls">
              <a href="/product#cleanup" className="">Open</a>
              <a href="#cleanup" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>11. Data Cleanup: Safe Deletion Workflows</span>
            </h2>
            <p>To ensure data integrity, deletions must follow hierarchical rules.</p>
            <pre>
{`graph TD
    A[Delete Subtask] --> B[Delete Task]
    B --> C[Delete Project]
    C --> D[Delete User]
    D --> E[Delete Team]
    E --> F[Delete Department]`}
            </pre>
          </article>

          <article id="faq" className="mb-6 action-box" data-side="left">
            <div className="action-controls">
              <a href="/product#faq" className="">Open</a>
              <a href="#faq" className="secondary">Link</a>
            </div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>12. Frequently Asked Questions (FAQ)</span>
            </h2>
            <h3>Q1: Why does a Department delete fail?</h3>
            <p>A department cannot be deleted if there are active teams or employees still assigned to it. Reassign personnel before deleting the department.</p>

            <h3>Q2: Why is a team member's status shown as "Overloaded" on the Workload page?</h3>
            <p>The overload status is triggered when capacity utilization exceeds 90%.</p>

            <h3>Q3: How do I change between Light and Dark mode?</h3>
            <p>Use the Theme Toggle in the top-right header or in Account Settings to switch themes.</p>

            <h3>Q4: I uploaded my profile picture but it isn't appearing. What should I do?</h3>
            <p>Ensure the file is a valid image and within size limits. Refresh the page to re-fetch the image.</p>

            <h3>Q5: How is Project Variance calculated on the Analytics page?</h3>
            <p>Project Variance measures the difference between actual progress and the original schedule. Positive variance means the project is ahead; negative means delayed.</p>
          </article>

          <footer style={{ marginTop: '2rem', color: 'var(--muted)' }}>
            <p>For more details visit: <a href="https://nextgentask.co.in" target="_blank" rel="noreferrer">https://nextgentask.co.in</a></p>
          </footer>
        </div>
      </div>
    </main>
  );
}
