const AppLayout = ({ children, sidebar }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      {sidebar && (
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {sidebar}
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
