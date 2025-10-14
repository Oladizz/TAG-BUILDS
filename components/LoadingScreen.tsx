import React from 'react';
import { TagIcon } from './icons/TagIcon';

const LoadingScreen: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-black animate-fade-in overflow-hidden">
            <div className="relative w-28 h-28 flex items-center justify-center">
                {/* The round container with animation */}
                <div className="w-full h-full rounded-full bg-black/30 border-2 border-green-500/20 shadow-2xl shadow-green-500/20 animate-pulse-glow flex items-center justify-center overflow-hidden">
                    <TagIcon className="w-24 h-24 object-cover" />
                </div>
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-400 tracking-widest animate-fade-in-up-text">
                TAG ID
            </p>
            <style>{`
                @keyframes pulse-glow {
                    0%, 100% {
                        transform: scale(0.98);
                        box-shadow: 0 0 20px rgba(0, 255, 0, 0.2), 0 0 40px rgba(0, 255, 0, 0.1);
                    }
                    50% {
                        transform: scale(1);
                        box-shadow: 0 0 40px rgba(0, 255, 0, 0.4), 0 0 80px rgba(0, 255, 0, 0.2);
                    }
                }
                .animate-pulse-glow {
                    animation: pulse-glow 2.5s infinite ease-in-out;
                }

                @keyframes fade-in-up-text {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up-text {
                    animation: fade-in-up-text 1s ease-out forwards;
                    animation-delay: 0.2s; /* Start after logo is visible */
                    opacity: 0; /* Start hidden */
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;