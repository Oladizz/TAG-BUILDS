import React, { createContext, useState, useContext, useCallback, ReactNode, useEffect } from 'react';

export type ToastType = 'loading' | 'success' | 'error' | 'info';

export interface ToastState {
    isVisible: boolean;
    message: string;
    type: ToastType;
}

interface ToastOptions {
    message: string;
    type?: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (options: ToastOptions) => void;
    hideToast: () => void;
    toastState: ToastState;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const initialState: ToastState = {
    isVisible: false,
    message: '',
    type: 'info',
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toastState, setToastState] = useState<ToastState>(initialState);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    const hideToast = useCallback(() => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setToastState(prev => ({ ...prev, isVisible: false }));
    }, [timeoutId]);

    const showToast = useCallback(({ message, type = 'info', duration = 4000 }: ToastOptions) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setToastState({ isVisible: true, message, type });

        if (type !== 'loading') {
            const id = window.setTimeout(() => {
                hideToast();
            }, duration);
            setTimeoutId(id);
        }
    }, [hideToast, timeoutId]);

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast, toastState }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
