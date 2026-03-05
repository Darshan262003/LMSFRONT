import type { ReactNode } from 'react';
import Navbar from '../UI/Navbar';

interface AppLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

const AppLayout = ({ children, sidebar }: AppLayoutProps) => {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content">
        {/* Left Sidebar */}
        {sidebar && (
          <aside className="course-sidebar">
            {sidebar}
          </aside>
        )}

        {/* Main Content Area */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
