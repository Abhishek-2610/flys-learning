import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-400">
              FLYS Shift System
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            {user ? (
              <>
                <Link 
                  to="/" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition"
                >
                  Schedule
                </Link>
                
                <Link 
                  to="/attendance" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition"
                >
                  Attendance Logs
                </Link>

                {/* Only Admin/Scheduler sees the Assign button */}
                {(user.role === 'admin' || user.role === 'scheduler') && (
                  <Link 
                    to="/assign" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 transition"
                  >
                    Assign Shift
                  </Link>
                )}

                <div className="flex items-center ml-4 pl-4 border-l border-slate-600">
                  <span className="text-xs text-gray-400 mr-3">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;