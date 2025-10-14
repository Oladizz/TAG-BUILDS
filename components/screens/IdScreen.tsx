import React, { useState, useEffect } from 'react';
import { useTagId } from '../../context/TagIdContext';
import { checkAvailability } from '../../services/mockContract';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import TagIdCard from '../TagIdCard';
import type { Tab } from '../App';

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1H9Z" clipRule="evenodd" />
    </svg>
);


interface IdScreenProps {
    setActiveTab: (tab: Tab) => void;
}

const IdScreen: React.FC<IdScreenProps> = ({ setActiveTab }) => {
    const { state, dispatch } = useTagId();
    const [localName, setLocalName] = useState(state.tagName);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setLocalName(state.tagName);
    }, [state.tagName]);
    
    const handleCheck = async () => {
        if (!localName || !localName.includes('.')) {
            dispatch({ type: 'SET_AVAILABILITY', payload: false });
            return;
        }
        setIsLoading(true);
        dispatch({ type: 'SET_AVAILABILITY', payload: null });
        const isAvailable = await checkAvailability(localName);
        dispatch({ type: 'SET_AVAILABILITY', payload: isAvailable });
        if (isAvailable) {
            dispatch({ type: 'SET_TAG_NAME', payload: localName });
            setTimeout(() => setActiveTab('verify'), 800);
        }
        setIsLoading(false);
    };

    const renderStatus = () => {
        if (isLoading) return null;
        if (state.isAvailable === true) {
            return <p className="text-green-400 text-sm mt-2 animate-fade-in">✅ Awesome! "{state.tagName}" is available.</p>;
        }
        if (state.isAvailable === false) {
            return <p className="text-red-400 text-sm mt-2 animate-fade-in">❌ Sorry, that name is taken or invalid.</p>;
        }
        return <div className="h-[28px] mt-2"></div>; // Placeholder to prevent layout shift
    };

    const inputStatus = state.isAvailable === true ? 'success' : state.isAvailable === false ? 'error' : 'default';

    return (
        <div className="flex flex-col space-y-8">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-3xl font-extrabold">Choose Your TAG ID</h2>
                    <div className="relative group">
                        <InfoIcon className="w-5 h-5 text-gray-500" />
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-gray-900 border border-white/10 rounded-lg text-xs text-center text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                            Your .tag is your digital identity—a decentralized, human-readable username for the new web.
                        </div>
                    </div>
                </div>
                <p className="text-gray-400">Enter your desired tag and check if it’s available.</p>
            </div>
            
            <div className="flex items-start space-x-3">
                <div className="flex-1">
                    <Input 
                        label="e.g., kyra.tag" 
                        value={localName}
                        status={inputStatus}
                        onChange={(e) => {
                            setLocalName(e.target.value);
                            if (state.isAvailable !== null) {
                               dispatch({ type: 'SET_AVAILABILITY', payload: null });
                            }
                        }}
                    />
                     {renderStatus()}
                </div>
                <Button onClick={handleCheck} isLoading={isLoading} disabled={!localName} className="mt-[2px]">
                    Check
                </Button>
            </div>
           
            {localName && (
                <div className="animate-fade-in">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4 text-center">Live Preview</h3>
                    <TagIdCard state={{...state, tagName: localName}} isGlassmorphism />
                </div>
            )}
        </div>
    );
};

export default IdScreen;