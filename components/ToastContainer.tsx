import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Toast } from './ui/Toast';
import type { ToastState } from '../context/ToastContext';

export const ToastContainer: React.FC = () => {
    const { toastState } = useToast();
    const [currentToast, setCurrentToast] = useState<ToastState | null>(null);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (toastState.isVisible) {
            setCurrentToast(toastState);
            setIsExiting(false);
        } else if (currentToast) {
            setIsExiting(true);
            const timer = setTimeout(() => {
                setCurrentToast(null);
            }, 300); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [toastState, currentToast]);

    if (!currentToast) {
        return null;
    }

    return <Toast {...currentToast} isExiting={isExiting} />;
};
