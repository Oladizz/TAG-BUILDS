import React from 'react';
import type { TagIdState } from '../types';

interface SearchResultItemProps {
    result: TagIdState;
    onClick: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, onClick }) => {
    return (
        <div onClick={onClick} className="cursor-pointer">
            <div className="flex items-center space-x-2 whitespace-nowrap text-sm font-medium text-gray-400 bg-white/5 backdrop-blur-sm rounded-full pl-1.5 pr-4 py-1.5 border border-white/10 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl hover:shadow-green-500/30">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <img 
                        src={result.pfp} 
                        alt={result.tagName} 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <span>{result.tagName}</span>
            </div>
        </div>
    );
};

export default SearchResultItem;
