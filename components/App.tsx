import React, { useState, useEffect } from 'react';
import { TagIdProvider, useTagId } from '../context/TagIdContext';
import { ToastProvider } from '../context/ToastContext';
import { WalletProvider, useWallet } from '../context/WalletContext';
import TagIdExplorer from './TagIdExplorer';
import BottomNav from './layout/BottomNav';
import Header from './layout/Header';
import IdScreen from './screens/IdScreen';
import VerificationScreen from './screens/VerificationScreen';
import ProfileScreen from './screens/ProfileScreen';
import MintScreen from './screens/MintScreen';
import { ToastContainer } from './ToastContainer';
import LoadingScreen from './LoadingScreen';
import { getTagIdByWalletAddress } from '../services/backendApi';

export type Tab = 'id' | 'verify' | 'profile' | 'mint';

const Wizard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('id');

    const renderActiveScreen = () => {
        switch (activeTab) {
            case 'id':
                return <IdScreen setActiveTab={setActiveTab} />;
            case 'verify':
                return <VerificationScreen setActiveTab={setActiveTab} />;
            case 'profile':
                return <ProfileScreen setActiveTab={setActiveTab} />;
            case 'mint':
                return <MintScreen />;
            default:
                return <IdScreen setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="h-full w-full selection:bg-green-500/30">
            <ToastContainer />
            <div className="relative w-full h-full overflow-hidden">
                <Header activeTab={activeTab} />
                
                <main className="h-full w-full overflow-y-auto custom-scrollbar">
                    <div className="pt-28 pb-32 px-6">
                        <div className="animate-fade-in" key={activeTab}>
                           {renderActiveScreen()}
                        </div>
                    </div>
                </main>
                
                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>
    );
}


const AppContent: React.FC = () => {
    const { state, dispatch } = useTagId();
    const { walletAddress, isConnected } = useWallet();
    const [appStatus, setAppStatus] = useState<'initializing' | 'wizard' | 'explorer'>('initializing');

    useEffect(() => {
        const checkForExistingId = async () => {
            if (isConnected && walletAddress) {
                try {
                    const existingId = await getTagIdByWalletAddress(walletAddress);
                    if (existingId) {
                        dispatch({ type: 'SET_FULL_STATE', payload: existingId });
                        setAppStatus('explorer');
                    } else {
                        // Wallet connected, but no ID, start the wizard
                        dispatch({ type: 'RESET_STATE' });
                        setAppStatus('wizard');
                    }
                } catch (error) {
                    console.error("Failed to check for existing ID:", error);
                    // If check fails, default to wizard
                    setAppStatus('wizard');
                }
            } else {
                // Not connected, go to wizard
                dispatch({ type: 'RESET_STATE' });
                setAppStatus('wizard');
            }
        };

        checkForExistingId();
    }, [isConnected, walletAddress, dispatch]);

    // This effect handles the transition from wizard to explorer upon successful minting
    useEffect(() => {
        if (state.mintStatus === 'success' && appStatus === 'wizard') {
            setAppStatus('explorer');
        }
    }, [state.mintStatus, appStatus]);


    if (appStatus === 'initializing') {
        return <LoadingScreen />;
    }

    if (appStatus === 'explorer') {
        return (
            <div className="h-full w-full selection:bg-green-500/30">
                <ToastContainer />
                <TagIdExplorer />
            </div>
        );
    }

    return <Wizard />;
};

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial asset loading for splash screen effect
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <TagIdProvider>
            <ToastProvider>
                <WalletProvider>
                    <AppContent />
                </WalletProvider>
            </ToastProvider>
        </TagIdProvider>
    );
};

export default App;
