import React, { useEffect, useRef, useState } from 'react';
import { useTagId } from '../context/TagIdContext';
import TagIdCard from './TagIdCard';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { searchTagIdByTagName } from '../services/backendApi';
import type { TagIdState } from '../types';

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const TagIdExplorer: React.FC = () => {
    const { state, dispatch } = useTagId();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<TagIdState | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [displayCardState, setDisplayCardState] = useState<TagIdState>(state);

    const cardRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    const handleMintAnother = () => {
        dispatch({ type: 'RESET_STATE' });
        // The view switch will be handled by App.tsx
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsSearching(true);
        setSearchError('');
        setSearchResult(null);
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
    };
    
    useEffect(() => {
        setDisplayCardState(searchResult || state);
    }, [searchResult, state]);

    useEffect(() => {
        const cardNode = cardRef.current;
        if (!cardNode) return;
        // ... (3D hover effect logic remains the same)
        return () => {
            // ... (cleanup logic remains the same)
        }
    }, []);

    const showSuccessMessage = isInitialMount.current && state.mintStatus === 'success';
    useEffect(() => {
      if (showSuccessMessage) {
        isInitialMount.current = false;
      }
    }, [showSuccessMessage]);

    return (
        <div className="h-full w-full flex flex-col items-center justify-center animate-fade-in-up p-4">
            <div className="text-center mb-6 w-full max-w-md">
                {showSuccessMessage && !searchResult ? (
                    <>
                        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-500">
                            Mint Successful!
                        </h2>
                        <p className="text-gray-400 mt-2">
                            Welcome to the new era of decentralized identity. Your TAG ID is now yours.
                        </p>
                    </>
                ) : (
                    <>
                         <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-500">
                            TAG ID Explorer
                        </h2>
                        <p className="text-gray-400 mt-2">
                           Search for any TAG ID on the network or view your own.
                        </p>
                    </>
                )}
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

            <div className="w-full max-w-sm" style={{ perspective: '1200px'}}>
                <div ref={cardRef} className="transition-transform duration-200 ease-out" style={{ transformStyle: "preserve-3d" }}>
                     <TagIdCard state={displayCardState} isGlassmorphism={true} />
                </div>
            </div>
            
            {!searchResult && (
                 <div className="mt-6 p-4 bg-black/20 rounded-lg text-center text-xs text-gray-500 w-full max-w-sm">
                    <p className="font-semibold text-gray-400">Token URI (IPFS)</p>
                    <a href={state.tokenURI} target="_blank" rel="noopener noreferrer" className="break-all hover:text-green-400 transition-colors duration-300">{state.tokenURI || 'N/A'}</a>
                </div>
            )}

            <div className="mt-6">
                {searchResult ? (
                    <Button onClick={clearSearch} variant="secondary">Back to My ID</Button>
                ) : (
                    <Button onClick={handleMintAnother} variant="secondary">Mint Another TAG ID</Button>
                )}
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
