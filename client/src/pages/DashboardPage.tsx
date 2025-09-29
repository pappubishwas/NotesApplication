import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import api, { setAuthToken } from '../services/api'; // Make sure setAuthToken is imported

// Note interface
interface Note {
  _id: string;
  title: string;
  content: string;
}
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Fetch notes 
  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem('token');

    if (token) {
      // Set the token for all future API requests
      setAuthToken(token);
    } else {
      // If no token, then redirect to login
      navigate('/login'); 
      console.error("No token found. User is not authenticated.");
    }

    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/notes');
        setNotes(res.data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []); 

  // Modal Control Functions
  const openCreateModal = () => {
    setCurrentNote(null);
    setNoteTitle("");
    setNoteContent("");
    setIsModalOpen(true);
  };
  
  const openEditModal = (note: Note) => {
    setCurrentNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
    setNoteTitle("");
    setNoteContent("");
  };

  // API Call Handlers
  const handleDelete = async (id: string) => {
    setNotes(notes.filter(note => note._id !== id));
    try {
      await api.delete(`/notes/${id}`);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };
  
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const noteData = { title: noteTitle, content: noteContent };

    try {
      if (currentNote) {
        const res = await api.put(`/notes/${currentNote._id}`, noteData);
        setNotes(notes.map(note => note._id === currentNote._id ? res.data : note));
      } else {
        const res = await api.post('/notes', noteData);
        setNotes(prev => [res.data, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
        <button 
          onClick={openCreateModal}
          className="flex items-center bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Create Note
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading notes...</p>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map(note => (
            <NoteCard key={note._id} note={note} onDelete={handleDelete} onUpdate={openEditModal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">No notes yet!</h2>
          <p className="text-gray-500 mt-2">Click "Create Note" to get started.</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentNote ? 'Edit Note' : 'New Note'}</h2>
            <form onSubmit={handleSaveNote}>
              <div className="space-y-4">
                <input
                  type="text" placeholder="Title" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <textarea
                  placeholder="Content" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} rows={6}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex justify-end items-center mt-6 space-x-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className={`px-4 py-2 font-semibold text-white rounded-lg transition-colors ${isSaving ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'}`}>
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;