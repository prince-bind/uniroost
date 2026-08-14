"use client"
import React from 'react'
import { Users, Sparkles } from 'lucide-react'

const FindRoommatePage = () => {
    return (
        <main className="min-h-screen pt-44 pb-20 bg-white relative overflow-hidden flex items-center justify-center">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-50/50 to-transparent rounded-full -z-10 blur-3xl opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 to-transparent rounded-full -z-10 blur-3xl opacity-60"></div>

            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 font-semibold text-sm mb-8 animate-bounce">
                    <Sparkles size={16} />
                    <span>Launching Soon</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
                    Find your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">room partner</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Our AI-powered roommate matching system is being refined to help you find the perfect campus companion. Stay tuned!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center space-x-2 text-gray-500 font-bold">
                        <Users size={20} className="text-cyan-600" />
                        <span>5,000+ Students Waiting</span>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default FindRoommatePage