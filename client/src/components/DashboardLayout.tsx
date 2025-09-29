import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom';
import { setAuthToken } from '../services/api';
import api from '../services/api';

interface Note {
  _id: string;
  title: string;
  content: string;
}

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const navigate = useNavigate();

  // Fetch all notes 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);

    const fetchAllNotes = async () => {
      try {
        const res = await api.get('/notes');
        setNotes(res.data);
      } catch (error) {
        console.error("Could not fetch notes for sidebar", error);
      }
    };
    fetchAllNotes();
  }, []);
  
  // Logout function 
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken();
    navigate('/login');
  };
  
  // This function will be passed down to the grid to update the sidebar in real-time
  const refreshNotes = async () => {
    const res = await api.get('/notes');
    setNotes(res.data);
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}>
        <div className="p-5 text-2xl font-bold border-b border-gray-700">
          <Link to="/dashboard">Notes App</Link>
        </div>
        
        <nav className="mt-5 px-2 flex-1 overflow-y-auto">
          <NavLink to="/dashboard" end className={({isActive}) => `flex items-center px-3 py-2 rounded-md ${isActive ? 'bg-teal-600' : 'text-gray-300'} hover:bg-gray-700`}>
            All Notes
          </NavLink>
          <hr className="my-3 border-gray-700"/>
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Notes</h3>
          <div className="mt-2 space-y-1">
             {notes.map(note => (
               <NavLink key={note._id} to={`/dashboard/notes/${note._id}`} className={({isActive}) => `block w-full text-left px-3 py-2 text-sm rounded-md truncate ${isActive ? 'bg-gray-700' : ''} text-gray-300 hover:bg-gray-700`}>
                 {note.title || "Untitled Note"}
               </NavLink>
             ))}
          </div>
        </nav>

        <div className="p-5 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 rounded">
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow-md md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6">
          <Outlet context={{ refreshNotes }} />
        </main>
      </div>

      {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
    </div>
  );
};

export default DashboardLayout;