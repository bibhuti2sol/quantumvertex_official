import React from "react";
import ProductLogo from "../../components/ProductLogo";
import InteractiveChart from "../../components/InteractiveChart";
import ActionableFlow from "../../components/ActionableFlow";

export default function ProductPage() {
  return (
    <main className="product-page">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          zIndex: 0
        }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 md:py-14 relative z-10">
        {/* Theme + prose styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
          .product-page{ position:relative; overflow:hidden; overflow-x:hidden; width:100%; max-width:100vw; min-height:100vh; padding-top:7.5rem; background:
            radial-gradient(circle at 18% 2%, rgba(0,212,255,0.22), transparent 32rem),
            radial-gradient(circle at 84% 10%, rgba(245,158,11,0.14), transparent 30rem),
            linear-gradient(135deg, #070b16 0%, #0c1423 44%, #070b16 100%);
          }
          :root{
            --accent-cyan:#00D4FF;
            --accent-lime:#A3E635;
            --accent-pink:#FB7185;
            --text-primary:#F0F4FF;
            --text-secondary:#94A3B8;
            --muted:#4B5E7A;
            --card-bg:rgba(12, 18, 32, 0.76);
          }
          .prose-container{ max-width:100%; min-width:0; margin:0 auto; color:var(--text-secondary); font-family: 'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; line-height:1.75 }
          .prose-container h1{ color:var(--text-primary); font-family: 'Plus Jakarta Sans', sans-serif; font-weight:900 }
          .prose-container h2{ color:var(--text-primary); font-size:1.35rem; margin-top:1.4rem; margin-bottom:0.6rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight:800 }
          .prose-container h3{ color:var(--text-primary); font-size:1.1rem; margin-top:1rem; margin-bottom:0.5rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight:600 }
          .prose-container p{ margin-bottom:0.9rem }
          .prose-container a{ color:var(--accent-cyan); text-decoration:none; transition:opacity 0.2s }
          .prose-container a:hover{ opacity:0.8; text-decoration:underline }
          .prose-container code{ background:rgba(255,255,255,0.06); padding:0.12rem 0.36rem; border-radius:6px; color:var(--accent-cyan); font-size:0.9em }
          .prose-container pre{ background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.07); padding:1rem; border-radius:12px; overflow:auto; color:var(--text-primary); font-family: monospace; font-size:0.9rem }
          h2,h3{ scroll-margin-top:7.5rem }
          .product-hero{ position:relative; min-height:calc(100vh - 8rem); display:grid; grid-template-columns:minmax(0,0.95fr) minmax(360px,1.05fr); gap:3rem; align-items:center; padding:2rem 0 5rem; }
          .hero-copy{ max-width:650px; }
          .product-kicker{ display:inline-flex; align-items:center; gap:0.65rem; padding:0.55rem 0.85rem; border:1px solid rgba(255,255,255,0.12); border-radius:999px; background:rgba(255,255,255,0.06); color:#dbeafe; font-weight:800; font-size:0.78rem; letter-spacing:0.08em; text-transform:uppercase; }
          .status-dot{ width:0.55rem; height:0.55rem; border-radius:999px; background:var(--accent-lime); box-shadow:0 0 18px rgba(163,230,53,0.9); }
          .hero-title{ margin:1.15rem 0 1rem; font-size:clamp(2.75rem, 6vw, 5.9rem); line-height:0.94; letter-spacing:0; }
          .hero-title span{ display:block; background:linear-gradient(90deg,#f8fafc 0%,#67e8f9 45%,#facc15 100%); -webkit-background-clip:text; color:transparent; }
          .hero-subtitle{ max-width:620px; color:#b7c4d8; font-size:1.12rem; line-height:1.8; }
          .hero-actions{ display:flex; flex-wrap:wrap; gap:0.85rem; margin-top:1.65rem; }
          .hero-button{ display:inline-flex; align-items:center; justify-content:center; gap:0.55rem; min-height:48px; padding:0 1.2rem; border-radius:12px; font-weight:900; border:1px solid rgba(255,255,255,0.12); transition:all 0.25s ease; }
          .hero-button.primary{ color:#06111c; background:linear-gradient(135deg,#67e8f9,#a3e635); box-shadow:0 18px 46px rgba(0,212,255,0.23); }
          .hero-button.secondary{ color:#eff6ff; background:rgba(255,255,255,0.06); }
          .hero-button:hover{ transform:translateY(-2px); }
          .hero-metrics{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:0.8rem; margin-top:2rem; max-width:560px; }
          .metric-tile{ border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:1rem; background:rgba(255,255,255,0.055); }
          .metric-tile strong{ display:block; color:#fff; font-size:1.45rem; line-height:1; }
          .metric-tile span{ display:block; margin-top:0.45rem; color:#8fa3bd; font-size:0.82rem; }
          .product-preview{ position:relative; }
          .preview-shell{ border:1px solid rgba(255,255,255,0.13); border-radius:26px; background:linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.045)); padding:0.8rem; box-shadow:0 30px 90px rgba(0,0,0,0.5); }
          .preview-topbar{ display:flex; align-items:center; justify-content:space-between; padding:0.35rem 0.45rem 0.75rem; color:#9fb0c7; font-size:0.78rem; font-weight:800; }
          .preview-dots{ display:flex; gap:0.38rem; }
          .preview-dots span{ width:0.62rem; height:0.62rem; border-radius:999px; background:#475569; }
          .preview-dots span:nth-child(1){ background:#fb7185; }
          .preview-dots span:nth-child(2){ background:#facc15; }
          .preview-dots span:nth-child(3){ background:#a3e635; }
          .preview-shell img{ display:block; width:100%; aspect-ratio:16/10; object-fit:cover; border-radius:18px; border:1px solid rgba(255,255,255,0.1); }
          .floating-panel{ position:absolute; right:-1rem; bottom:-1.4rem; width:min(300px,70%); border:1px solid rgba(255,255,255,0.14); border-radius:18px; padding:1rem; background:rgba(7,11,22,0.86); backdrop-filter:blur(18px); box-shadow:0 20px 55px rgba(0,0,0,0.38); }
          .floating-panel strong{ color:#fff; font-size:0.95rem; }
          .floating-panel div{ height:0.5rem; border-radius:999px; margin-top:0.75rem; background:linear-gradient(90deg,#67e8f9 0 76%,rgba(255,255,255,0.12) 76%); }
          .section-layout{ display:grid; grid-template-columns:260px minmax(0,1fr); gap:1.2rem; align-items:start; min-width:0; }
          .section-layout > *{ min-width:0; }
          .toc-panel{ position:sticky; top:6.5rem; }
          .toc-grid{ display:grid; grid-template-columns:1fr; gap:1rem }
          .toc-grid ol{ margin:0 }

          .action-box{ position:relative; background:var(--card-bg); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:26px; margin-bottom:1rem; transition: all 0.25s ease; width:100%; min-width:0; box-sizing:border-box; overflow:hidden; box-shadow:0 18px 60px rgba(0,0,0,0.2); }
          .action-box *{ min-width:0; }
          .action-box h2, .action-box h3{ max-width:100%; }
          .action-box h2 span:last-child, .action-box h3 span:last-child{ overflow-wrap:anywhere; word-break:normal; }
          .action-box::before{ content:''; position:absolute; inset:0 0 auto 0; height:1px; background:linear-gradient(90deg, transparent, rgba(103,232,249,0.8), rgba(250,204,21,0.5), transparent); }
          .action-box[data-side="left"], .action-box[data-side="right"]{ margin-left:0; margin-right:0; border-left:1px solid rgba(255,255,255,0.1); border-right:1px solid rgba(255,255,255,0.1); }
          .action-box:hover{ border-color:rgba(103,232,249,0.28); transform:translateY(-2px); box-shadow: 0 24px 70px rgba(0,0,0,0.32), 0 0 42px rgba(0, 212, 255, 0.08); }

          .action-controls{ position:absolute; right:20px; top:20px; display:flex; gap:8px; align-items:center }
          .action-box[data-side="right"] .action-controls{ left:20px; right:auto }
          .action-controls a{ padding:6px 12px; border-radius:8px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:var(--text-primary); font-weight:600; text-decoration:none; font-size:0.85rem; transition:all 0.2s }
          .action-controls a:hover{ background:var(--accent-cyan); color:#080C18 }
          .action-controls a.secondary{ background:transparent; border:1px solid rgba(255,255,255,0.1) }
          .action-controls a.secondary:hover{ background:rgba(255,255,255,0.1); color:var(--text-primary) }

          /* Media/image responsive */
          .section-media{ margin:20px 0; display:flex; justify-content:center; border-radius:16px; overflow:hidden; border:1px solid rgba(255, 255, 255, 0.1); background:rgba(255,255,255,0.04); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.34) }
          .section-media img{ width:100%; height:auto; display:block; transition:transform 0.4s ease-in-out }
          .section-media img:hover{ transform:scale(1.03) }
          .section-pill{ width:34px; height:34px; border-radius:11px; display:inline-flex; align-items:center; justify-content:center; flex:0 0 auto; color:#06111c; font-weight:900; background:linear-gradient(135deg,#67e8f9,#a3e635); box-shadow:0 12px 28px rgba(0,212,255,0.2); }

          /* responsive: tablet and mobile */
          @media (max-width:1024px){ 
            .product-hero{ grid-template-columns:1fr; min-height:auto; padding-top:1rem; }
            .section-layout{ grid-template-columns:1fr; }
            .toc-panel{ position:relative; top:auto; }
            .action-box{ width:100%; padding:20px }
            .prose-container h2{ font-size:1.25rem }
            .prose-container p{ font-size:0.95rem }
          }
          @media (max-width:768px){ 
            .toc-grid{ grid-template-columns:1fr } 
            .prose-container{ padding:0 } 
            .prose-container .hero-title{ font-size:3.35rem; line-height:0.96; }
            .action-controls{ position:static; margin-top:12px; justify-content:flex-start; gap:8px }
            .action-box{ padding:16px; width:100%; max-width:100%; margin-left:auto; margin-right:auto; border-left:4px solid var(--accent-cyan) !important; border-right:none !important }
            .action-box[data-side="right"]{ border-left:4px solid var(--accent-cyan) !important; border-right:none !important; margin-left:auto; margin-right:auto }
            .prose-container h1{ font-size:1.75rem }
            .prose-container h2{ font-size:1.15rem }
            .prose-container h3{ font-size:1rem }
            .prose-container p{ font-size:0.9rem }
            .hero-metrics{ grid-template-columns:1fr; }
            .floating-panel{ position:relative; right:auto; bottom:auto; width:100%; margin-top:0.8rem; }
          }
          @media (max-width:480px){
            .product-page > div.relative{ padding-left:10px; padding-right:10px; }
            .action-box{ padding:12px; margin-bottom:1.25rem }
            .prose-container .hero-title{ font-size:3.05rem; }
            .prose-container h1{ font-size:1.5rem }
            .prose-container h2{ font-size:1.05rem }
            .prose-container h3{ font-size:0.9rem }
            .prose-container p{ font-size:0.85rem; line-height:1.6 }
            .action-controls a{ padding:4px 8px; font-size:0.75rem }
            table{ font-size:0.75rem }
          }
        ` }} />

        <div className="prose-container">
          <header className="product-hero">
            <div className="hero-copy">
              <div className="product-kicker"><span className="status-dot" /> Enterprise workflow OS</div>
              <h1 className="hero-title">NextGen <span>Task Manager</span></h1>
              <p className="hero-subtitle">
                A polished command center for planning, assigning, tracking, and analyzing work across high-performing teams.
              </p>
              <div className="hero-actions">
                <a className="hero-button primary" href="#dashboard">Explore Product</a>
                <a className="hero-button secondary" href="https://www.nextgentask.co.in" target="_blank" rel="noreferrer">Visit Website</a>
              </div>
              <div className="hero-metrics">
                <div className="metric-tile"><strong>360°</strong><span>Project visibility</span></div>
                <div className="metric-tile"><strong>RBAC</strong><span>Role-safe operations</span></div>
                <div className="metric-tile"><strong>Live</strong><span>Kanban and analytics</span></div>
              </div>
            </div>
            <div className="product-preview">
              <ProductLogo className="h-12 md:h-14 object-contain mb-4" />
              <div className="preview-shell">
                <div className="preview-topbar">
                  <div className="preview-dots"><span /><span /><span /></div>
                  <span>nextgentask.co.in/dashboard</span>
                </div>
                <img src="/assets/images/dashboard_preview_1780221206697.png" alt="NextGen Task Manager dashboard preview" />
              </div>
              <div className="floating-panel">
                <strong>Workload health</strong>
                <div aria-hidden />
                <p style={{ margin: "0.7rem 0 0", color: "#9fb0c7", fontSize: "0.82rem" }}>Smart visibility across projects, teams, and delivery risk.</p>
              </div>
            </div>
          </header>

          <div className="section-layout">
            <aside className="toc-panel">
              <section id="toc" className="mb-8 action-box" style={{ padding: "20px" }}>
                <h2 style={{ margin: "0 0 16px 0", fontSize: "1rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Contents</h2>
                <div className="toc-grid">
                  <ol className="list-decimal list-inside" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    <li className="mb-2"><a href="#landing">Landing &amp; Authentication</a></li>
                    <li className="mb-2"><a href="#dashboard">Dashboard</a></li>
                    <li className="mb-2"><a href="#user-management">Directory Management</a></li>
                    <li className="mb-2"><a href="#projects">Project Management</a></li>
                    <li className="mb-2"><a href="#tasks">Task Lifecycle</a></li>
                    <li className="mb-2"><a href="#kanban">Kanban Board</a></li>
                    <li className="mb-2"><a href="#focus">Focus Mode</a></li>
                    <li className="mb-2"><a href="#resource">Resource Allocation</a></li>
                    <li className="mb-2"><a href="#analytics">Analytics</a></li>
                    <li className="mb-2"><a href="#settings">Settings</a></li>
                    <li className="mb-2"><a href="#cleanup">Data Cleanup</a></li>
                    <li className="mb-2"><a href="#faq">FAQ</a></li>
                  </ol>
                </div>
              </section>
            </aside>

            <div>
          <section id="about" className="mb-6 action-box" data-side="left">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span className="section-pill" aria-hidden>0</span>
              <span>About NextGenTask Manager</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
              <p>NextGen Task Manager is a comprehensive, enterprise-grade project and task management solution built to streamline organizational workflows. By bridging the gap between high-level strategic planning and day-to-day execution, NextGen provides a centralized hub where teams can collaborate, track progress, and achieve their goals with maximum efficiency.</p>

              <p>Whether you are managing complex multi-team projects, tracking individual assignments via a Kanban board, or analyzing organizational workload through visual analytics, NextGen Task Manager equips you with an intuitive, responsive, and highly customizable interface. Key capabilities include robust role-based access control, deep hierarchical organization (departments and teams), seamless cross-functional reporting, and dynamic task lifecycle tracking.</p>

              <p>Designed for scalability and user satisfaction, NextGen Task Manager transforms chaos into structured, actionable intelligence—empowering your workforce to focus on what truly matters: delivering exceptional results.</p>

              <h3 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px' }}>
              <span className="section-pill" aria-hidden>R</span>
              <span>Role-Based Access &amp; Privileges</span>
            </h3>
              <p>Security and operational hierarchy are core to NextGen Task Manager. The system employs strict Role-Based Access Control (RBAC) to ensure users only interact with data and features appropriate to their organizational standing. The three primary roles are:</p>
              <ul>
                <li><strong>Admin:</strong> The highest level of access. Admins have complete control over the system, including the ability to manage all users, oversee global organizational settings, assign roles, and access sensitive profile data (such as Date of Joining, Employee IDs, and Reporting chains). Admins can view, edit, and delete any project, task, or team across the entire organization.</li>
                <li><strong>Manager:</strong> Designed for team leaders and department heads. Managers possess elevated privileges to oversee their specific projects and direct reports. They can create tasks, assign work to associates, view team workloads, and manage project milestones. While they have broad operational control within their domains, they cannot modify critical global system settings or sensitive employee profile configurations.</li>
                <li><strong>Associate:</strong> The foundational role for individual contributors. Associates are granted focused access to execute their day-to-day responsibilities. They can view projects they are assigned to, update task statuses on the Kanban board, log activity, and manage their basic personal profile data. Associates are restricted from administrative actions such as altering deadlines or reassigning tasks to others.</li>
              </ul>
            </div>
          </section>

          <article id="landing" className="mb-6 action-box" data-side="right">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>1. Landing Page &amp; Authentication</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
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
            </div>
          </article>

          <article id="dashboard" className="mb-6 action-box" data-side="left">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>2. Unified Command Center: Dashboard</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
              <p>Once logged in, you will be greeted by the <strong>Dashboard</strong>, the central control hub of the application.</p>
              <h3>A. Core Features &amp; Metrics</h3>
              <ul>
                <li><strong>Active Summaries:</strong> Live indicators showing <em>Total Projects</em>, <em>Active Tasks</em>, <em>Assigned Members</em>, and <em>Budget Burn</em> status.</li>
                <li><strong>Dynamic Project Filtering:</strong> Locate the project dropdown filter at the top of the dashboard. Changing the selected project dynamically updates all downstream task counts, completion percentages, and visual workload distributions in real-time.</li>
                <li><strong>Quick-Access Navigation Sidebar:</strong> Use the left collapsible sidebar to jump to all functional tabs, such as Tasks, Kanban, Analytics, Team, User Management, and Settings.</li>
              </ul>

              <div className="section-media">
                <img
                  src="/assets/images/dashboard_preview_1780221206697.png"
                  alt="NextGen Task Manager Dashboard Snapshot"
                />
              </div>

              {/* Interactive chart: actionable analytics summary */}
              <InteractiveChart />
              <p style={{ marginTop: "14px" }}>The dashboard supports dynamic filtering and quick actions for most entities.</p>
            </div>
          </article>

          <article id="user-management" className="mb-6 action-box" data-side="right">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>3. User &amp; Organizational Directory Management</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
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

              <div className="section-media">
                <img
                  src="/assets/images/user_management_preview_1780221263353.png"
                  alt="User Directory & Org Structure Preview"
                />
              </div>
            </div>
          </article>

          <article id="projects" className="mb-6 action-box" data-side="left">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>4. Project &amp; Milestone Management</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
              <h3>A. Create a Project</h3>
              <ol>
                <li>Navigate to <strong>Projects</strong> and click <strong>Create Project</strong>.</li>
                <li>Fill in <em>Project Name</em>, <em>Description</em>, <em>Total Budget</em>, assign a <em>Project Manager</em>, select start/end dates and priority, then click <strong>Create Project</strong>.</li>
              </ol>
              <h3>C. Milestone Tracking</h3>
              <p>Under each project's details you will find the <strong>Milestone Progress Tracker</strong> showing major phase gates.</p>

              <div className="section-media">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="auto" viewBox="0 0 700 250" style={{ maxHeight: "250px" }}>
                  <rect width="700" height="250" fill="#111827" rx="8" />
                  <g transform="translate(50,30)">
                    <text x="0" y="0" fontSize="14" fontWeight="700" fill="#F0F4FF">Project Milestone Progress</text>
                    <line x1="0" x2="600" y1="50" y2="50" stroke="#00D4FF" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="0" cy="50" r="8" fill="#00D4FF" />
                    <circle cx="150" cy="50" r="8" fill="#3b82f6" />
                    <circle cx="300" cy="50" r="8" fill="#8b5cf6" />
                    <circle cx="450" cy="50" r="8" fill="#ec4899" />
                    <circle cx="600" cy="50" r="8" fill="#f59e0b" />
                    <g fontSize="12" fill="#94A3B8">
                      <text x="-20" y="90">Planning</text>
                      <text x="130" y="90">Dev</text>
                      <text x="280" y="90">Testing</text>
                      <text x="430" y="90">Deploy</text>
                      <text x="580" y="90">Live</text>
                    </g>
                  </g>
                </svg>
              </div>

              <div className="section-media">
                <img
                  src="/assets/images/project_management_preview_1780221282132.png"
                  alt="Project Milestone Tracking Dashboard"
                />
              </div>
            </div>
          </article>

          <article id="tasks" className="mb-6 action-box" data-side="right">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>5. Task &amp; Subtask Lifecycle Management</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
              <p>The granular level of daily operations is executed via the <strong>Task Management</strong> panel.</p>

              {/* Actionable flowchart for task lifecycle */}
              <ActionableFlow />

              <div className="overflow-auto mt-6">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse', color: 'var(--text-secondary)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th className="text-left py-2 font-bold" style={{ color: 'var(--text-primary)' }}>Action</th>
                      <th className="text-left py-2 font-bold" style={{ color: 'var(--text-primary)' }}>Target</th>
                      <th className="text-left py-2 font-bold" style={{ color: 'var(--text-primary)' }}>Fields Required</th>
                      <th className="text-left py-2 font-bold" style={{ color: 'var(--text-primary)' }}>Key Behavior</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="py-3" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>Create Task</td>
                      <td>Parent Project</td>
                      <td>Title, Description, Priority, Assignee, Status, Dates</td>
                      <td>Automatically adds the task to both the list and Kanban board.</td>
                    </tr>
                    <tr>
                      <td className="py-3" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>Edit Task</td>
                      <td>Active Task</td>
                      <td>Status, Assignee, Priority, Description</td>
                      <td>Live-syncs updates across all views immediately.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </article>

          <article id="kanban" className="mb-6 action-box" data-side="left">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>6. Interactive Kanban Board</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
              <ol>
                <li>Navigate to the <strong>Kanban Board</strong> tab on the sidebar.</li>
                <li>The board is divided into four columns: <strong>TODO</strong>, <strong>IN_PROGRESS</strong>, <strong>REVIEW</strong>, and <strong>DONE</strong>.</li>
                <li>Drag &amp; drop task cards between columns. Drops trigger a secure update to the server to persist state.</li>
              </ol>

              <div className="section-media">
                <img
                  src="/assets/images/kanban_board_preview_1780221228339.png"
                  alt="Kanban Board Drag & Drop Interface"
                />
              </div>
            </div>
          </article>

          <article id="focus" className="mb-6 action-box" data-side="right">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>7. Focus Mode Panel</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
              <ol>
                <li>Select <strong>Focus</strong> from the navigation sidebar.</li>
                <li>Create subtasks inline and check them off as you complete them to maintain peak daily velocity.</li>
              </ol>
            </div>
          </article>

          <article id="resource" className="mb-6 action-box" data-side="left">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>8. Resource Allocation &amp; Team Workload</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
              <h3>A. Team Capacity Dashboard</h3>
              <p>Use filters to select Departments and Teams. The page displays capacity index, current tasks and average completion times.</p>

              <div className="section-media">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="auto" viewBox="0 0 700 280" style={{ maxHeight: "280px" }}>
                  <rect width="700" height="280" fill="#111827" rx="8" />
                  <g transform="translate(50,30)">
                    <text x="0" y="0" fontSize="14" fontWeight="700" fill="#F0F4FF">Team Workload Distribution</text>
                    <g transform="translate(0,40)">
                      <rect x="0" y="0" width="400" height="30" rx="4" fill="#00D4FF" opacity="0.3" />
                      <rect x="0" y="0" width="280" height="30" rx="4" fill="#00D4FF" />
                      <text x="290" y="22" fontSize="12" fill="#080C18" fontWeight="bold">70%</text>
                      <text x="0" y="-5" fontSize="11" fill="#94A3B8">Engineering</text>
                    </g>
                    <g transform="translate(0,95)">
                      <rect x="0" y="0" width="400" height="30" rx="4" fill="#3b82f6" opacity="0.3" />
                      <rect x="0" y="0" width="320" height="30" rx="4" fill="#3b82f6" />
                      <text x="330" y="22" fontSize="12" fill="#ffffff" fontWeight="bold">80%</text>
                      <text x="0" y="-5" fontSize="11" fill="#94A3B8">Design</text>
                    </g>
                    <g transform="translate(0,150)">
                      <rect x="0" y="0" width="400" height="30" rx="4" fill="#8b5cf6" opacity="0.3" />
                      <rect x="0" y="0" width="200" height="30" rx="4" fill="#8b5cf6" />
                      <text x="210" y="22" fontSize="12" fill="#ffffff" fontWeight="bold">50%</text>
                      <text x="0" y="-5" fontSize="11" fill="#94A3B8">QA</text>
                    </g>
                    <g transform="translate(0,205)">
                      <rect x="0" y="0" width="400" height="30" rx="4" fill="#ec4899" opacity="0.3" />
                      <rect x="0" y="0" width="360" height="30" rx="4" fill="#ec4899" />
                      <text x="370" y="22" fontSize="12" fill="#ffffff" fontWeight="bold">90%</text>
                      <text x="0" y="-5" fontSize="11" fill="#94A3B8">DevOps</text>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </article>

          <article id="analytics" className="mb-6 action-box" data-side="right">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>9. Enterprise Analytics &amp; Visual BI</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
              <ul>
                <li>Project Budget Analysis</li>
                <li>Resource Utilization Heatmap</li>
                <li>Project Performance Overview</li>
              </ul>

              <div className="section-media">
                <img
                  src="/assets/images/analytics_preview_1780221244348.png"
                  alt="Analytics BI Dashboard Screenshot"
                />
              </div>
            </div>
          </article>

          <article id="settings" className="mb-6 action-box" data-side="left">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>10. Personal Settings &amp; Profile Customization</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
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

              <div className="section-media">
                <img
                  src="/assets/images/settings_preview_1780221296918.png"
                  alt="Settings & Profile Configuration Panel"
                />
              </div>
            </div>
          </article>

          <article id="cleanup" className="mb-6 action-box" data-side="right">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>11. Data Cleanup: Safe Deletion Workflows</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
              <p>To ensure data integrity, deletions must follow hierarchical rules.</p>
              <pre>
                {`graph TD
    A[Delete Subtask] --> B[Delete Task]
    B --> C[Delete Project]
    C --> D[Delete User]
    D --> E[Delete Team]
    E --> F[Delete Department]`}
              </pre>
            </div>
          </article>

          <article id="faq" className="mb-6 action-box" data-side="left">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2px', margin: 0 }}>
              <span aria-hidden style={{ width: 8, height: 28, borderRadius: 6, background: 'linear-gradient(180deg, var(--accent-cyan), #16a34a)' }} />
              <span>12. Frequently Asked Questions (FAQ)</span>
            </h2>
            <div style={{ marginTop: "16px" }}>
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
            </div>
          </article>


            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
