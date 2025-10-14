import React, { useState, useEffect, useRef } from 'react';
import { useTagId } from '../../context/TagIdContext';
import type { Tab } from '../App';
import { verifyBiometrics } from '../../services/mockApi';

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

const FingerprintIcon = (props: { className?: string }) => (
    <svg className={props.className || "w-8 h-8"} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.789-2.756 9.356-1.747 2.566-2.593 4.145-2.593 4.145H17.35c0 0-.846-1.579-2.593-4.145C13.009 17.789 12 14.517 12 11zM12 11c0-2.21.896-4.21 2.343-5.657C15.79 3.896 17.79 3 20 3V7c-1.105 0-2.105.448-2.828 1.172C16.448 8.895 16 9.895 16 11s.448 2.105 1.172 2.828C17.895 14.552 18.895 15 20 15v4c-2.21 0-4.21-.896-5.657-2.343C12.896 15.21 12 13.21 12 11zM4 3v4c1.105 0 2.105.448 2.828 1.172C7.552 8.895 8 9.895 8 11s-.448 2.105-1.172 2.828C6.105 14.552 5.105 15 4 15v4c2.21 0 4.21-.896 5.657-2.343C11.104 15.21 12 13.21 12 11" /></svg>
);

const TARGET_PHRASE = "My voice is my passport, verify me.";

const normalizeText = (text: string) => text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();

interface VoiceVerificationProps {
    status: 'idle' | 'loading' | 'success';
    onVerify: () => void;
}

const VoiceVerification: React.FC<VoiceVerificationProps> = ({ status, onVerify }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const handleRecord = () => {
        setError('');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = (event) => {
            setError(`Error: ${event.error}. Please try again.`);
            setIsRecording(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (normalizeText(transcript) === normalizeText(TARGET_PHRASE)) {
                onVerify();
            } else {
                setError("That wasn't quite right. Please try again.");
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const renderContent = () => {
        if (status === 'success') {
            return (
                <div className="flex flex-col items-center justify-center space-y-3 text-green-400 animate-fade-in">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="font-semibold text-lg text-green-300">Verified Successfully</p>
                </div>
            );
        }
        if (status === 'loading') {
            return (
                 <div className="flex flex-col items-center justify-center space-y-3 animate-fade-in">
                    <svg className="animate-spin h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-gray-300 font-semibold">Verifying...</p>
                </div>
            )
        }

        return (
             <div className="flex flex-col items-center justify-center space-y-3 text-center animate-fade-in">
                <div className="text-center mb-4">
                    <p className="text-gray-400 text-sm">Please say:</p>
                    <p className="font-semibold text-lg text-green-300">"{TARGET_PHRASE}"</p>
                </div>
                <div className={`relative w-24 h-24 flex items-center justify-center rounded-full transition-all duration-300 ${isRecording ? 'bg-green-500/10' : 'bg-black/20'}`}>
                    {isRecording && <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping"></div>}
                    <MicIcon className={`w-12 h-12 transition-colors duration-300 ${isRecording ? 'text-green-300' : 'text-gray-400 group-hover:text-green-400'}`} />
                </div>
                <p className="font-semibold text-white text-lg">{isRecording ? 'Listening...' : 'Tap Mic to Speak'}</p>
                 {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            </div>
        );
    }
    
    const isDisabled = status !== 'idle' || isRecording;

    return (
        <button
            onClick={handleRecord}
            disabled={isDisabled}
            className={`relative p-10 border-2 border-dashed rounded-2xl transition-all duration-300 min-h-[200px] w-full flex flex-col items-center justify-center
                disabled:cursor-not-allowed group shadow-md shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/30
                ${status === 'success' ? 'border-green-500 ring-4 ring-green-500/20 bg-green-500/10 !shadow-xl !shadow-green-500/40' : ''}
                ${isRecording ? 'border-green-500/50 bg-black/20 !shadow-xl !shadow-green-500/40' : ''}
                ${status === 'idle' && !isRecording ? 'border-white/10 bg-black/20 hover:border-green-500' : ''}
            `}
        >
            {renderContent()}
        </button>
    );
};


interface FingerprintScannerProps {
    status: 'idle' | 'loading' | 'success';
    onScan: () => void;
    error?: string;
}

const FingerprintScanner: React.FC<FingerprintScannerProps> = ({ status, onScan, error }) => {
    const isScanning = status === 'loading';
    const isSuccess = status === 'success';

    const renderContent = () => {
        if (isSuccess) {
            return (
                <div className="flex flex-col items-center justify-center space-y-3 text-green-400 animate-fade-in">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="font-semibold text-lg text-green-300">Verified Successfully</p>
                </div>
            );
        }

        return (
             <div className="flex flex-col items-center justify-center space-y-3 text-center animate-fade-in">
                <div className={`relative w-24 h-24 flex items-center justify-center rounded-full transition-all duration-300 ${isScanning ? 'bg-green-500/10' : 'bg-black/20'}`}>
                    {isScanning && <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-spin" style={{ animationDuration: '1.5s' }}></div>}
                    <FingerprintIcon className={`w-12 h-12 transition-colors duration-300 ${isScanning ? 'text-green-300' : 'text-gray-400 group-hover:text-green-400'}`} />
                </div>
                <p className="font-semibold text-white text-lg">{isScanning ? 'Verifying...' : 'Verify with Biometrics'}</p>
                <p className="text-sm text-gray-400">{isScanning ? 'Waiting for device...' : "Uses your device's secure sensor"}</p>
                {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            </div>
        );
    }
    
    return (
        <button
            onClick={onScan}
            disabled={isScanning || isSuccess}
            className={`relative p-10 border-2 border-dashed rounded-2xl transition-all duration-300 min-h-[200px] w-full flex flex-col items-center justify-center
                disabled:cursor-not-allowed group shadow-md shadow-green-500/10 hover:shadow-xl hover:shadow-green-500/30
                ${isSuccess ? 'border-green-500 ring-4 ring-green-500/20 bg-green-500/10 !shadow-xl !shadow-green-500/40' : ''}
                ${isScanning ? 'border-green-500/50 bg-black/20 cursor-wait !shadow-xl !shadow-green-500/40' : ''}
                ${status === 'idle' ? 'border-white/10 bg-black/20 hover:border-green-500' : ''}
            `}
        >
            {renderContent()}
        </button>
    );
};


interface VerificationScreenProps {
    setActiveTab: (tab: Tab) => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ setActiveTab }) => {
    const { state, dispatch } = useTagId();
    const [voiceStatus, setVoiceStatus] = useState<'idle' | 'loading' | 'success'>(state.isHuman ? 'success' : 'idle');
    const [fingerprintStatus, setFingerprintStatus] = useState<'idle' | 'loading' | 'success'>(state.fingerprintVerified ? 'success' : 'idle');
    const [fingerprintError, setFingerprintError] = useState('');
    const navigatedRef = useRef(false);

    useEffect(() => {
        const isComplete = state.isHuman && state.fingerprintVerified;
        if (isComplete && !navigatedRef.current) {
            navigatedRef.current = true;
            setTimeout(() => {
                setActiveTab('profile');
            }, 1200);
        }
    }, [state.isHuman, state.fingerprintVerified, setActiveTab]);

    const handleVoiceVerification = () => {
        setVoiceStatus('loading');
        // Simulate a brief processing time for better UX
        setTimeout(() => {
            dispatch({ type: 'SET_IS_HUMAN', payload: true });
            setVoiceStatus('success');
        }, 800);
    };

    const handleFingerprintScan = async () => {
        setFingerprintError('');
        setFingerprintStatus('loading');

        try {
            const result = await verifyBiometrics();

            if (result.success) {
                dispatch({ type: 'SET_FINGERPRINT_VERIFIED', payload: true });
                setFingerprintStatus('success');
            } else {
                setFingerprintError('Verification failed. Please try again.');
                setFingerprintStatus('idle');
            }
        } catch (err) {
            console.error('Biometric verification error:', err);
            setFingerprintError('An unexpected error occurred. Please try again.');
            setFingerprintStatus('idle');
        }
    };
    
    return (
        <div className="flex flex-col space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Human Verification</h2>
                <p className="text-gray-400 mt-1">Complete these steps to prove you're human. This is for demonstration only.</p>
            </div>
            
            <VoiceVerification 
                status={voiceStatus}
                onVerify={handleVoiceVerification}
            />

            <FingerprintScanner 
                status={fingerprintStatus}
                onScan={handleFingerprintScan}
                error={fingerprintError}
            />
        </div>
    );
};

export default VerificationScreen;