import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';


const Navbar: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUserName(res.data.name || 'User'); 
          console.log("User data fetched:", res.data);
          setIsAuthenticated(true);
        })
        .catch(err => {
          console.error("Auth check failed:", err);
          handleLogout();
        });
    } else {
      setIsAuthenticated(false);
      setUserName('');
    }
  }, [location]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(); 
    setIsAuthenticated(false);
    setProfileOpen(false);
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-2xl font-bold text-teal-600">
              Keep Your Notes
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">Welcome, {userName}!</span>
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold">
                    {userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-teal-600 font-medium transition-colors">Login</Link>
                <Link to="/" className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors">Sign Up</Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button JSX... */}
                    <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-teal-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
          </div>
        </div>
      </div>
       {/* Mobile Menu JSX... */}
             {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Login</Link>
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-50">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;