'use client';

import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const featureTags = [
  'Task Management',
  'Project Management',
  'Time Tracking',
  'Document Management',
  'Attendance Tracking',
  'Collaboration',
];

const LoginInteractive = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-background via-background to-primary/5">
      {/* Left: Illustration & Welcome */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:rounded-r-[3rem] shadow-2xl relative overflow-hidden min-h-[480px]">
        {/* Illustration (replace with your SVG or image if available) */}
        <div className="mb-8">
          <Link href="/">
            <div className="w-[320px] h-[220px] bg-white/80 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 cursor-pointer">
              <div className="flex flex-col items-center gap-1 mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                  NextGenTask
                </span>
                <span className="text-lg font-semibold text-success">Manager</span>
              </div>
              {/* Dummy Graphs */}
              <div className="flex flex-col items-center gap-3 w-full">
                {/* Bar Graph */}
                <svg
                  width="120"
                  height="40"
                  viewBox="0 0 120 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="10" y="20" width="10" height="15" rx="2" fill="#60a5fa" />
                  <rect x="30" y="10" width="10" height="25" rx="2" fill="#34d399" />
                  <rect x="50" y="25" width="10" height="10" rx="2" fill="#fbbf24" />
                  <rect x="70" y="5" width="10" height="30" rx="2" fill="#818cf8" />
                  <rect x="90" y="15" width="10" height="20" rx="2" fill="#f472b6" />
                </svg>
                {/* Line Graph */}
                <svg
                  width="120"
                  height="40"
                  viewBox="0 0 120 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <polyline
                    points="0,35 20,25 40,30 60,10 80,20 100,5 120,15"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="0" cy="35" r="2" fill="#60a5fa" />
                  <circle cx="20" cy="25" r="2" fill="#60a5fa" />
                  <circle cx="40" cy="30" r="2" fill="#60a5fa" />
                  <circle cx="60" cy="10" r="2" fill="#60a5fa" />
                  <circle cx="80" cy="20" r="2" fill="#60a5fa" />
                  <circle cx="100" cy="5" r="2" fill="#60a5fa" />
                  <circle cx="120" cy="15" r="2" fill="#60a5fa" />
                </svg>
              </div>
              <div className="w-full flex justify-between mb-2">
                <div className="w-16 h-16 bg-primary/10 rounded-lg" />
                <div className="w-24 h-8 bg-accent/20 rounded-lg" />
              </div>
              <div className="w-full h-8 bg-primary/20 rounded mb-2" />
              <div className="w-full h-4 bg-muted/30 rounded mb-1" />
              <div className="w-full h-4 bg-muted/30 rounded mb-1" />
              <div className="w-1/2 h-4 bg-muted/20 rounded" />
            </div>
          </Link>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 text-center">
          Welcome to NextGenTask
        </h2>
        <p className="text-base text-muted-foreground mb-4 text-center max-w-xs">
          You're just one step away from peak productivity!
        </p>
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {featureTags.map((tag) => (
            <span
              key={tag}
              className="bg-white/80 text-primary font-semibold text-xs px-3 py-1 rounded-full shadow border border-primary/10"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-lg font-bold text-primary mt-2 text-center">All in ONE place...!</p>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl p-8 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-heading font-bold text-xl">N</span>
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NextGenTask
              </h2>
              <p className="text-xs font-caption text-accent font-semibold tracking-wide">
                Manager
              </p>
            </div>
          </div>
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h3>
            <p className="text-sm text-muted-foreground">Please enter your details to sign in.</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginInteractive;
