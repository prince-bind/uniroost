import React from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen w-full">
      {children}
    </div>
  );
}
