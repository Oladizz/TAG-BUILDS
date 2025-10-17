import React, { useState, useEffect } from 'react';
import { useTagId } from '../../context/TagIdContext';
import { checkTagNameAvailability } from '../../services/backendApi';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import TagIdCard from '../TagIdCard';
import type { Tab } from '../App';

interface IdScreenProps {
    setActiveTab: (tab: Tab) => void;
}

const IdScreen: React.FC<IdScreenProps> = ({ setActiveTab }) => {
    const { state, dispatch } = useTagId();
    const [localName, setLocalName] = useState(state.tagName.replace(/\.tag$/i, ''));
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        setLocalName(state.tagName.replace(/\.tag$/i, ''));
    }, [state.tagName]);
    
    const handleCheck = async () => {
        if (!localName) {
            dispatch({ type: 'SET_AVAILABILITY', payload: false });
            return;
        }
        setIsLoading(true);
        dispatch({ type: 'SET_AVAILABILITY', payload: null });

        const cleanedName = localName.trim().replace(/\.tag$/i, '');
        const fullName = `${cleanedName}.tag`;

        const isAvailable = await checkTagNameAvailability(fullName);
        dispatch({ type: 'SET_AVAILABILITY', payload: isAvailable });
        if (isAvailable) {
            dispatch({ type: 'SET_TAG_NAME', payload: fullName });
            setTimeout(() => setActiveTab('verify'), 800);
        }
        setIsLoading(false);
    };

    const renderStatus = () => {
        if (isLoading) return null;
        if (state.isAvailable === true) {
            return <p className="text-green-400 text-sm animate-fade-in mb-1">✅ Awesome! "{state.tagName}" is available.</p>;
        }
        if (state.isAvailable === false) {
            return <p className="text-red-400 text-sm animate-fade-in mb-1">❌ Sorry, that name is taken or invalid.</p>;
        }
        return null;
    };

    const inputStatus = state.isAvailable === true ? 'success' : state.isAvailable === false ? 'error' : 'default';
    const formattedPreviewName = localName ? `${localName.trim().replace(/\.tag$/i, '')}.tag` : '';
    const animatedSubheadlineText = "Enter your preferred TAG name to check its availability";


    return (
        <div className="flex flex-col space-y-8">
             <style>{`
                @keyframes trail-in {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0px);
                    }
                }
                .animate-trail-in {
                    animation: trail-in 0.6s ease-out forwards;
                }
            `}</style>
            <div className="text-center">
                <h2 className="text-3xl font-extrabold">Claim Your TAG ID</h2>
                <p className="text-gray-400 mt-2 min-h-[24px]">
                     {animatedSubheadlineText.split(' ').map((word, index) => (
                        <span
                            key={index}
                            className="inline-block animate-trail-in opacity-0"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            {word}&nbsp;
                        </span>
                    ))}
                </p>
            </div>
            
            <div className="flex items-start space-x-3">
                <div className="flex-1">
                    <Input 
                        label="e.g., kyra" 
                        value={localName}
                        status={inputStatus}
                        onChange={(e) => {
                            const sanitizedValue = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
                            setLocalName(sanitizedValue);
                            if (state.isAvailable !== null) {
                               dispatch({ type: 'SET_AVAILABILITY', payload: null });
                            }
                        }}
                    />
                    <div className="mt-2 px-1 min-h-[36px]">
                        {renderStatus()}
                        <p className="text-xs text-gray-500">
                            Only lowercase letters are allowed. No spaces, numbers, or special characters.
                        </p>
                    </div>
                </div>
                <Button onClick={handleCheck} isLoading={isLoading} disabled={!localName} className="mt-[2px]">
                    Check
                </Button>
            </div>
           
            {localName && (
                <div className="animate-fade-in">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4 text-center">Live Preview</h3>
                    <TagIdCard state={{...state, tagName: formattedPreviewName}} isGlassmorphism />
                </div>
            )}
        </div>
    );
};

export default IdScreen;