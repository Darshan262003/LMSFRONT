import { useNavigate } from 'react-router-dom';
import { authStore } from '../../stores/authStore';
import { Search, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = authStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <div className="navbar-left" onClick={() => navigate('/home')}>
          <h1 className="navbar-logo">LMS</h1>
        </div>

        {/* Center: Search Bar */}
        <div className="navbar-center">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search for courses" 
              className="search-input"
            />
          </div>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="navbar-right">
          {user && (
            <>
              <div className="user-profile">
                <User size={20} />
                <span className="user-name">{user.name || user.email}</span>
              </div>
              <button className="logout-button" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
