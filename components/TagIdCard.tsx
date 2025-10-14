import React from 'react';
import type { TagIdState } from '../types';
import { detectPlatform, getPlatformIcon } from './icons/SocialIcons';
import { TagIcon } from './icons/TagIcon';

interface TagIdCardProps {
    state: TagIdState;
    isGlassmorphism?: boolean;
}

const TagIdCard: React.FC<TagIdCardProps> = ({ state, isGlassmorphism = false }) => {
    const cardClasses = isGlassmorphism
        ? 'bg-black/20 backdrop-blur-2xl border border-white/10 shadow-xl shadow-green-500/20'
        : 'bg-gray-900/80 border border-gray-700 shadow-lg shadow-green-500/10';

    return (
        <div
            className={`w-full max-w-sm mx-auto rounded-3xl p-6 shadow-2xl transition-all duration-300 relative overflow-hidden ${cardClasses}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Background glow */}
            <div data-glow className="absolute top-1/2 left-1/2 w-72 h-72 bg-green-400/30 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out"></div>
            
            <div data-content className="relative z-10 transition-transform duration-200 ease-out">
                <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3 min-w-0">
                        <TagIcon className="w-8 h-8 text-green-300 mt-1 flex-shrink-0" />
                        <div className="bg-clip-text text-transparent bg-gradient-to-br from-green-300 to-green-200 min-w-0">
                            <p className="text-sm font-semibold tracking-wider uppercase">TAG ID</p>
                            <h2 className="text-3xl font-bold tracking-tight truncate">{state.tagName || 'your.tag'}</h2>
                        </div>
                    </div>
                    <div data-pfp className="w-20 h-20 rounded-full bg-gray-800 border-2 border-white/20 overflow-hidden shadow-lg flex-shrink-0 ml-4 transition-transform duration-200 ease-out">
                        {state.pfp ? (
                            <img src={state.pfp} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 space-y-3 text-sm text-gray-300">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-400">Name</span>
                        <span className="font-medium text-white">{state.legalInfo.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-400">Nationality</span>
                        <span className="font-medium text-white">{state.legalInfo.nationality || 'N/A'}</span>
                    </div>
                </div>
                
                <div className="mt-6 flex items-center space-x-3">
                    {state.socials.filter(s => s.url && detectPlatform(s.url) !== 'unknown').map(social => {
                        const platform = detectPlatform(social.url);
                        const icon = getPlatformIcon(platform);

                        return (
                            <a 
                                key={social.id}
                                href={social.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label={platform}
                            >
                                <span className="w-5 h-5 block">{icon}</span>
                            </a>
                        );
                    })}
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
                     <div 
                        className="flex items-center space-x-2"
                        title={state.isHuman ? "This identity has been verified as human." : "Human verification pending. Complete the 'Verify' step."}
                     >
                        <div className={`w-3 h-3 rounded-full transition-colors ${state.isHuman ? 'bg-green-400 shadow-[0_0_8px_theme(colors.green.400)]' : 'bg-gray-600'}`}></div>
                        <p className="text-xs font-medium text-gray-400">Human Verified</p>
                    </div>
                    <img src="https://i.postimg.cc/FKmFxZ1P/u-b-52a61660-82d7-11ee-beed-414173dd7838.png" alt="Base Network" className="h-6 opacity-90"/>
                </div>
            </div>
        </div>
    );
};

export default TagIdCard;
