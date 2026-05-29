import { useState, useRef, useEffect } from 'react';

interface Project {
  id: number;
  name: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: number | null;
  onProjectChange: (projectId: number | null) => void;
}

const ProjectSelector = ({
  projects,
  selectedProjectId,
  onProjectChange,
}: ProjectSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-caption text-muted-foreground mb-1">
        Select Project
      </label>

      {/* Dropdown Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-[240px] h-10 px-3 flex items-center justify-between bg-card border border-border rounded-lg text-sm font-caption text-foreground cursor-pointer hover:border-primary transition-smooth focus-within:ring-2 focus-within:ring-primary/20"
      >
        <span className="truncate">
          {selectedProject ? selectedProject.name : 'Select Project'}
        </span>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border rounded-lg shadow-elevation-3 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <input
              autoFocus
              type="text"
              placeholder="Filter projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 px-2 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Projects List */}
          <ul className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar">
            <li
              onClick={() => {
                onProjectChange(null);
                setIsOpen(false);
                setSearchTerm('');
              }}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${!selectedProjectId ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-foreground'}`}
            >
              Select Project
            </li>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <li
                  key={project.id}
                  onClick={() => {
                    onProjectChange(project.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors ${selectedProjectId === project.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-foreground'}`}
                >
                  {project.name}
                </li>
              ))
            ) : (
              <li className="px-3 py-4 text-xs text-center text-muted-foreground italic">
                No projects found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;
