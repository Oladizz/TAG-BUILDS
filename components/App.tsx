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
import BackgroundTags from './BackgroundTags';
import LandingPage from './LandingPage';
import FloatingProfileTags from './FloatingProfileTags';

export type Tab = 'id' | 'verify' | 'profile' | 'mint';
type AppStatus = 'landing' | 'initializing' | 'wizard' | 'explorer';

interface WizardProps {
    onLogoClick: () => void;
    setAppStatus: (status: AppStatus) => void;
}

const Wizard: React.FC<WizardProps> = ({ onLogoClick, setAppStatus }) => {
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
                return <MintScreen setAppStatus={setAppStatus} />;
            default:
                return <IdScreen setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div className="h-full w-full selection:bg-green-500/30">
            <ToastContainer />
            <div className="relative w-full h-full overflow-hidden">
                <BackgroundTags />
                {activeTab === 'id' && (
                    <>
                        <FloatingProfileTags variant="background" />
                        <FloatingProfileTags variant="foreground" />
                    </>
                )}
                <Header activeTab={activeTab} onLogoClick={onLogoClick} />
                
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
    
    const [appStatus, setAppStatus] = useState<AppStatus>('landing');

    useEffect(() => {
        if (state.mintStatus === 'success') {
            setAppStatus('explorer');
        }
    }, [state.mintStatus]);

    useEffect(() => {
        const checkForExistingId = async () => {
            if (isConnected && walletAddress) {
                try {
                    const existingId = await getTagIdByWalletAddress(walletAddress);
                    if (existingId) {
                        dispatch({ type: 'SET_FULL_STATE', payload: existingId });
                        setAppStatus('explorer');
                    } else {
                        // Wallet connected, but no minted ID.
                        // The state is already loaded from localStorage by TagIdProvider.
                        // Just go to the wizard.
                        setAppStatus('wizard');
                    }
                } catch (error) {
                    console.error("Failed to check for existing ID:", error);
                    // If check fails, default to wizard
                    setAppStatus('wizard');
                }
            } else {
                 // Not connected, go to wizard.
                 // TagIdProvider will have reset the state.
                setAppStatus('wizard');
            }
        };

        if (appStatus === 'initializing') {
            checkForExistingId();
        }
    }, [isConnected, walletAddress, dispatch, appStatus]);

    const handleLaunchApp = (name?: string) => {
        if (name) {
            const fullName = name.trim().endsWith('.tag') ? name.trim() : `${name.trim()}.tag`;
            dispatch({ type: 'SET_TAG_NAME', payload: fullName });
        }
        setAppStatus('initializing');
    };

    const goToLanding = () => {
        dispatch({ type: 'RESET_STATE' });
        setAppStatus('landing');
    };

    const handleGoToExplorer = () => {
        setAppStatus('explorer');
    };

    if (appStatus === 'landing') {
        return <LandingPage onLaunch={handleLaunchApp} onGoToExplorer={handleGoToExplorer} />;
    }

    if (appStatus === 'initializing') {
        return <LoadingScreen />;
    }

    const mainContent = appStatus === 'explorer' ? (
        <div className="relative h-full w-full selection:bg-green-500/30">
            <BackgroundTags />
            <ToastContainer />
            <TagIdExplorer setAppStatus={setAppStatus} />
        </div>
    ) : (
        <Wizard onLogoClick={goToLanding} setAppStatus={setAppStatus} />
    );

    return (
        <div className="relative h-full w-full">
            {mainContent}
        </div>
    );
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
        <ToastProvider>
            <WalletProvider>
                <TagIdProvider>
                    <AppContent />
                </TagIdProvider>
            </WalletProvider>
        </ToastProvider>
    );
};

export default App;