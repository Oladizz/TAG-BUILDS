import React from 'react';
import { TagIcon } from '../icons/TagIcon';

type ToastType = 'loading' | 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    isExiting: boolean;
}

const LoadingSpinner = () => (
    <svg className="animate-spin h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
const SuccessIcon = () => (
    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ErrorIcon = () => (
    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ICONS: Record<ToastType, React.ReactNode> = {
    loading: <LoadingSpinner />,
    success: <SuccessIcon />,
    error: <ErrorIcon />,
    info: <SuccessIcon />, // Default info icon
};

export const Toast: React.FC<ToastProps> = ({ message, type, isExiting }) => {
    const animationClass = isExiting ? 'animate-toast-out' : 'animate-toast-in';

    return (
        <div 
            role="alert"
            aria-live="assertive"
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm p-4 rounded-xl shadow-2xl shadow-green-500/30 bg-black/60 backdrop-blur-lg border border-white/10 ${animationClass}`}
        >
            <div className="flex items-center">
                <div className="w-10 h-10 bg-black/30 rounded-lg flex items-center justify-center mr-4 shrink-0">
                    <TagIcon className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-white leading-tight">TAG ID System</p>
                    <p className="text-sm text-gray-300 leading-tight">{message}</p>
                </div>
                <div className="w-6 h-6 ml-4 shrink-0">{ICONS[type]}</div>
            </div>
            <style>{`
                @keyframes toast-in {
                    from { opacity: 0; transform: translate(-50%, -20px) scale(0.95); }
                    to { opacity: 1; transform: translate(-50%, 0) scale(1); }
                }
                @keyframes toast-out {
                    from { opacity: 1; transform: translate(-50%, 0) scale(1); }
                    to { opacity: 0; transform: translate(-50%, -20px) scale(0.95); }
                }
                .animate-toast-in { animation: toast-in 0.3s ease-out forwards; }
                .animate-toast-out { animation: toast-out 0.3s ease-in forwards; }
            `}</style>
        </div>
    );
};