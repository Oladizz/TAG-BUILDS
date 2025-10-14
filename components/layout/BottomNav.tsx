import React from 'react';
import { useTagId } from '../../context/TagIdContext';
import { NAV_ITEMS } from '../../constants';
import type { Tab } from '../App';

interface BottomNavProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const { state } = useTagId();

    return (
        <nav className="absolute bottom-0 left-0 right-0 z-20 mx-4 mb-4 rounded-2xl bg-black/50 backdrop-blur-lg border border-white/10 p-2 shadow-xl shadow-green-500/20">
            <div className="flex justify-around items-center">
                {NAV_ITEMS.map((item) => {
                    const isActive = activeTab === item.id;
                    const isComplete = item.isComplete(state);
                    // FIX: The 'isDisabled' property was removed from NAV_ITEMS. All tabs are now always clickable.
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`relative flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-all duration-300 group focus:outline-none focus-visible:bg-white/10
                                cursor-pointer hover:bg-white/5
                            `}
                        >
                            <div className="relative">
                                {isActive && (
                                    <div className="absolute -inset-2.5 rounded-full bg-green-500/20 blur-lg transition-all duration-500"></div>
                                )}
                                <item.icon className={`relative z-10 w-7 h-7 transition-colors ${isActive ? 'text-green-300' : 'text-gray-400 group-hover:text-white'}`} />
                                {isComplete && !isActive && (
                                     <div className="absolute -top-1 -right-1.5 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800 z-20"></div>
                                )}
                            </div>
                            <span className={`relative z-10 text-xs mt-2 font-semibold transition-colors ${isActive ? 'text-green-200' : 'text-gray-400 group-hover:text-white'}`}>
                                {item.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;