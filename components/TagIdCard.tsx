import React from 'react';
import type { TagIdState } from '../types';
import { detectPlatform, getPlatformIcon } from './icons/SocialIcons';
import { TagIcon } from './icons/TagIcon';

const BaseNetworkIcon = () => (
    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500">
        <div className="w-4 h-0.5 bg-white rounded-full"></div>
    </div>
);

interface TagIdCardProps {
    state: TagIdState;
    isGlassmorphism?: boolean;
}

const TagIdCard: React.FC<TagIdCardProps> = ({ state }) => {
    return (
        <div
            className="w-full max-w-lg mx-auto rounded-3xl p-6 shadow-2xl relative overflow-hidden bg-black border border-white/10 text-white"
        >
            <TagIcon className="absolute top-6 left-6 w-9 h-9" />
            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-900/60 rounded-full blur-xl" style={{ top: '65%' }}></div>
            
            <div className="relative z-10 flex flex-col">
                {/* Header */}
                <div className="flex justify-center mb-4">
                    <div className="flex items-center space-x-4 whitespace-nowrap text-lg font-medium text-gray-200 bg-white/5 backdrop-blur-sm rounded-full pl-4 pr-6 py-3 border border-white/10">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                            {state.pfp ? (
                                <img src={state.pfp} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                            )}
                        </div>
                        <span className="font-bold text-2xl">{state.tagName || 'your.tag'}</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow">
                    {state.bio && (
                        <p className="text-base text-gray-200 leading-relaxed">{state.bio}</p>
                    )}
                    
                    {state.skills && state.skills.length > 0 && (
                         <div className="mt-5 flex flex-wrap gap-2">
                            {state.skills.map(skill => (
                                <span key={skill} className="px-3 py-1.5 text-sm font-medium text-white bg-green-500/60 rounded-full">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 flex items-center space-x-5">
                        {state.socials.filter(s => s.url && detectPlatform(s.url) !== 'unknown').map(social => {
                            const platform = detectPlatform(social.url);
                            const icon = getPlatformIcon(platform);
                            return (
                                <a 
                                    key={social.id}
                                    href={social.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-gray-300 hover:text-white transition-colors"
                                    aria-label={platform}
                                >
                                    <span className="w-6 h-6 block">{icon}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto">
                    <div className="border-t border-white/20"></div>
                    <div className="pt-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3.5 h-3.5 rounded-full transition-colors ${state.isHuman ? 'bg-green-400 shadow-[0_0_8px_theme(colors.green.400)]' : 'bg-gray-600'}`}></div>
                            <p className="text-sm font-medium text-gray-300">Human Verified</p>
                        </div>
                        <BaseNetworkIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagIdCard;