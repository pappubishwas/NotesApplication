import React from 'react';
import { Link } from 'react-router-dom';

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (note: Note) => void; 
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete, onUpdate }) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    // Prevent the Link from navigating when a button is clicked
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link to={`/dashboard/notes/${note._id}`} className="group block">
      <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between min-h-[150px] h-full transition-transform transform group-hover:scale-105 group-hover:shadow-xl">
        <div>
          <h3 className="font-bold text-lg text-gray-800 truncate">{note.title || "Untitled Note"}</h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">{note.content}</p>
        </div>
        <div className="flex justify-end items-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { handleButtonClick(e); onUpdate(note); }} className="text-gray-400 hover:text-teal-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>
          </button>
          <button onClick={(e) => { handleButtonClick(e); onDelete(note._id); }} className="text-gray-400 hover:text-red-600 p-1 ml-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;