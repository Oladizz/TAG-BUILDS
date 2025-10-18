import React, { useState, useEffect, useRef } from 'react';
import { useTagId } from '../../context/TagIdContext';
import type { Tab } from '../App';
import { getGeolocationInfo } from '../../services/mockApi';
import { useToast } from '../../context/ToastContext';
import { Input } from '../ui/Input';

// FIX: Add type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
    item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onstart: () => void;
    onend: () => void;
    start(): void;
    stop(): void;
    abort(): void;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

const MicIcon = (props: { className?: string }) => (
    <svg className={props.className || "w-8 h-8"} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
);

const TARGET_PHRASE = "My voice is my passport, verify me.";

const normalizeText = (text: string) => text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();

const VoiceVerificationStep: React.FC<{
    voiceStatus: 'idle' | 'loading' | 'success';
    onVoiceVerify: () => void;
}> = ({ voiceStatus, onVoiceVerify }) => {
    
    const [isRecording, setIsRecording] = useState(false);
    const [voiceError, setVoiceError] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const handleRecord = () => {
        setVoiceError('');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setVoiceError('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = (event) => {
            setVoiceError(`Error: ${event.error}. Please try again.`);
            setIsRecording(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (normalizeText(transcript) === normalizeText(TARGET_PHRASE)) {
                onVoiceVerify();
            } else {
                setVoiceError("That wasn't quite right. Please try again.");
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const isFullyVerified = voiceStatus === 'success';

    if (isFullyVerified) {
        return (
            <div className="relative p-6 border-2 border-dashed rounded-2xl transition-all duration-300 min-h-[200px] w-full flex flex-col items-center justify-center shadow-md shadow-green-500/10 border-green-500 ring-4 ring-green-500/20 bg-green-500/10 !shadow-xl !shadow-green-500/40">
                <div className="flex flex-col items-center justify-center space-y-3 text-green-400 animate-fade-in">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="font-semibold text-lg text-green-300">Humanity Verified</p>
                </div>
            </div>
        );
    }
    
    return (
         <div className={`relative p-4 sm:p-6 border-2 border-dashed rounded-2xl transition-all duration-300 w-full flex flex-col items-center justify-center
                shadow-md shadow-green-500/10 border-white/10 bg-black/20
            `}
        >
            <div className="flex flex-col items-center justify-center w-full">
                <button 
                    onClick={handleRecord}
                    disabled={voiceStatus !== 'idle' || isRecording}
                    className="w-full p-4 rounded-lg hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent group"
                >
                    <div className="flex items-center text-left space-x-4">
                        <div className={`relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${isRecording ? 'bg-green-500/10' : 'bg-black/30'} border-2 ${voiceStatus === 'success' ? 'border-green-400/50' : 'border-white/10'}`}>
                            {isRecording && <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping"></div>}
                            {voiceStatus === 'success' ? (
                                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                                <MicIcon className={`w-7 h-7 transition-colors duration-300 ${isRecording ? 'text-green-300' : 'text-gray-400 group-hover:text-white'}`} />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className={`font-semibold text-lg ${voiceStatus === 'success' ? 'text-green-300' : 'text-white'}`}>
                                {isRecording ? 'Listening...' : (voiceStatus === 'success' ? 'Voice Verified' : 'Tap Mic to Speak')}
                            </p>
                            {voiceStatus !== 'success' && <p className="text-sm text-gray-400">And say: "{TARGET_PHRASE}"</p>}
                            {voiceError && <p className="text-xs text-red-400 mt-1">{voiceError}</p>}
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};


const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => {
    const id = React.useId();
    const labelBgColor = '#000000';

    return (
        <div className="relative group">
            <select
                id={id}
                className={`peer appearance-none w-full bg-black/20 border-2 rounded-lg py-3 px-4 text-white focus:outline-none transition-all duration-300 border-white/10 shadow-sm shadow-green-500/5 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:shadow-lg focus:shadow-green-500/20 ${props.value ? 'text-white' : 'text-gray-500'}`}
                {...props}
            >
                {children}
            </select>
            <label
                htmlFor={id}
                className={`absolute left-4 -top-2.5 text-xs px-1 transition-all
                           peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                           peer-focus:-top-2.5 peer-focus:text-xs 
                           peer-focus:text-green-400`}
                style={{ backgroundColor: labelBgColor }}
            >
                {label}
            </label>
             <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-green-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
};

interface VerificationScreenProps {
    setActiveTab: (tab: Tab) => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ setActiveTab }) => {
    const { state, dispatch } = useTagId();
    const { showToast } = useToast();
    const [voiceStatus, setVoiceStatus] = useState<'idle' | 'loading' | 'success'>(state.isHuman ? 'success' : 'idle');
    const [isFetchingNationality, setIsFetchingNationality] = useState(false);
    const navigatedRef = useRef(false);

     useEffect(() => {
        const fetchNationality = async () => {
            if (!state.legalInfo.nationality) {
                setIsFetchingNationality(true);
                try {
                    const data = await getGeolocationInfo();
                    dispatch({ type: 'SET_LEGAL_INFO', payload: { nationality: data.nationality } });
                } catch (error) {
                    console.error("Failed to fetch nationality", error);
                    showToast({ message: 'Could not auto-detect nationality.', type: 'error' });
                } finally {
                    setIsFetchingNationality(false);
                }
            }
        };

        fetchNationality();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    useEffect(() => {
        const legalInfoComplete = !!state.legalInfo.name && !!state.legalInfo.idCategory && !!state.legalInfo.idNumber && !!state.legalInfo.dob;
        const isComplete = state.isHuman && legalInfoComplete;

        if (isComplete && !navigatedRef.current) {
            navigatedRef.current = true;
            setTimeout(() => {
                setActiveTab('profile');
            }, 1200);
        }
    }, [state.isHuman, state.legalInfo, setActiveTab]);



    const handleVoiceVerification = () => {
        setVoiceStatus('loading');
        // Simulate a brief processing time for better UX
        setTimeout(() => {
            dispatch({ type: 'SET_IS_HUMAN', payload: true });
            setVoiceStatus('success');
        }, 800);
    };

    const handleLegalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        dispatch({
            type: 'SET_LEGAL_INFO',
            payload: { [e.target.name]: e.target.value }
        });
    };
    
    return (
        <div className="flex flex-col space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Human Verification</h2>
                <p className="text-gray-400 mt-1">Complete this step to prove you're human.</p>
            </div>
            
            <VoiceVerificationStep 
                voiceStatus={voiceStatus}
                onVoiceVerify={handleVoiceVerification}
            />

            <div className="space-y-4 pt-6 animate-fade-in">
                 <h3 className="text-xl font-bold text-center text-white">Legal Details</h3>
                 <p className="text-xs text-gray-500 text-center -mt-3">This information will not be displayed publicly on your ID and is secured through zero-knowledge proofs.</p>
                <Input label="Full Legal Name" name="name" value={state.legalInfo.name} onChange={handleLegalChange} />
                <Select label="Category of ID" name="idCategory" value={state.legalInfo.idCategory} onChange={handleLegalChange}>
                    <option value="" disabled>Select ID Type</option>
                    <option value="passport">Passport</option>
                    <option value="national_id">National ID</option>
                    <option value="drivers_license">Driver's License</option>
                </Select>
                <Input label="ID Number" name="idNumber" value={state.legalInfo.idNumber} onChange={handleLegalChange} />
                <Input label="Date of Birth" name="dob" type="date" value={state.legalInfo.dob} onChange={handleLegalChange} />
                <Input
                    label="Nationality"
                    name="nationality"
                    value={isFetchingNationality ? "Detecting..." : state.legalInfo.nationality}
                    disabled={true}
                />
            </div>
        </div>
    );
};

export default VerificationScreen;