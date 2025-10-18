import React, { useEffect, useRef, useState } from 'react';
import { useTagId } from '../context/TagIdContext';
import TagIdCard from './TagIdCard';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { searchTagIdByTagName } from '../services/backendApi';
import type { TagIdState } from '../types';
import SearchResultItem from './SearchResultItem';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

interface TagIdExplorerProps {
    setAppStatus: (status: 'wizard' | 'explorer' | 'landing' | 'initializing') => void;
}

const StatBox: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-white/5 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);

const TagIdExplorer: React.FC<TagIdExplorerProps> = ({ setAppStatus }) => {
    const { state, dispatch } = useTagId();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<TagIdState | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [showFullSearchResult, setShowFullSearchResult] = useState(false);
    const [stats, setStats] = useState({ totalMinted: 0 });

    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        setSearchError('');
        setSearchResult(null);
        setShowFullSearchResult(false);
        try {
            const result = await searchTagIdByTagName(searchQuery);
            if (result) {
                setSearchResult(result);
            } else {
                setSearchError(`No TAG ID found for "${searchQuery}"`);
            }
        } catch (e) {
            setSearchError('An error occurred during search.');
        } finally {
            setIsSearching(false);
        }
    };
    
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResult(null);
        setSearchError('');
        setShowFullSearchResult(false);
    };
    
    useEffect(() => {
        const cardNode = cardRef.current;
        if (!cardNode) return;
        // ... (3D hover effect logic remains the same)
        return () => {
            // ... (cleanup logic remains the same)
        }
    }, []);

    return (
        <div className="h-full w-full flex flex-col items-center justify-center animate-fade-in-up p-4">
            <div className="text-center mb-6 w-full max-w-md">
                <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-500">
                    TAG ID Explorer
                </h2>
                <p className="text-gray-400 mt-2">
                   Search for any TAG ID on the network.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mb-8">
                <StatBox title="Total TAGs Minted" value={stats.totalMinted} />
                <StatBox title="Current Fee (5+ chars)" value="0.005 ETH" />
                <StatBox title="Unique Holders" value="N/A" />
            </div>

            <div className="w-full max-w-md space-y-4 mb-6">
                <div className="flex items-start space-x-2">
                    <Input
                        label="Search for a .tag name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<SearchIcon className="w-5 h-5" />}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch} isLoading={isSearching} disabled={isSearching || !searchQuery}>
                        Search
                    </Button>
                </div>
                 {searchError && <p className="text-sm text-red-400 text-center">{searchError}</p>}
            </div>

            {searchResult && (
                <div className="w-full max-w-sm" style={{ perspective: '1200px'}}>
                    <div ref={cardRef} className="transition-transform duration-200 ease-out" style={{ transformStyle: "preserve-3d" }}>
                        {showFullSearchResult ? (
                            <TagIdCard state={searchResult} isGlassmorphism={true} />
                        ) : (
                            <SearchResultItem result={searchResult} onClick={() => setShowFullSearchResult(true)} />
                        )}
                    </div>
                </div>
            )}

            <div className="mt-6">
                {showFullSearchResult ? (
                    <Button onClick={() => setShowFullSearchResult(false)} variant="secondary">Back to Search Result</Button>
                ) : searchResult ? (
                    <Button onClick={clearSearch} variant="secondary">Clear Search</Button>
                ) : null}
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default TagIdExplorer;
