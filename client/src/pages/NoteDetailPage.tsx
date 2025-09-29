import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { setAuthToken } from '../services/api';

interface Note {
  _id: string;
  title: string;
  content: string;
}

const NoteDetailPage: React.FC = () => {
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { noteId } = useParams<{ noteId: string }>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
    
    const fetchNote = async () => {
      if (!noteId) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/notes/${noteId}`);
        setNote(res.data);
      } catch (error) {
        console.error("Failed to fetch note:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading note...</p>;
  }

  if (!note) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          {/* Exclamation Icon */}
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">Note Not Found</h2>
        <p className="mt-2 text-gray-600">
          Sorry, we couldn't find the note you're looking for. It might have been deleted or the link may be incorrect.
        </p>
        <Link 
          to="/dashboard" 
          className="mt-6 inline-flex items-center bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-teal-700 transition-colors"
        >
          &larr; Back to All Notes
        </Link>
      </div>
    );
  }


  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <Link to="/dashboard" className="text-teal-600 hover:text-teal-800 mb-6 inline-block">&larr; Back to all notes</Link>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{note.title}</h1>
      <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{note.content}</p>
    </div>
  );
};

export default NoteDetailPage;