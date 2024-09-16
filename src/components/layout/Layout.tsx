import React from 'react';
import Navbar from './Navbar.tsx';  // Change this line

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-gray-800"> {/* Changed bg-gray-100 to bg-gray-800 */}
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;