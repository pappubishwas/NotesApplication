import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar /> 
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-1 w-full">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;