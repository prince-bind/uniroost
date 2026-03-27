import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-100/40 via-transparent to-blue-100/30 -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10"></div>
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
