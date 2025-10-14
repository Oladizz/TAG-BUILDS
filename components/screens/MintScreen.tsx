import React from 'react';
import { useTagId } from '../../context/TagIdContext';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../context/ToastContext';
import { mintTagID } from '../../services/mockContract';
import { Button } from '../ui/Button';
import TagIdCard from '../TagIdCard';

const MintScreen: React.FC = () => {
    const { state, dispatch } = useTagId();
    const { isConnected, connectWallet } = useWallet();
    const { showToast, hideToast } = useToast();
    
    const isReadyToMint = !!state.tagName && state.isAvailable === true && state.isHuman && state.fingerprintVerified && !!state.legalInfo.name;

    const handleMint = async () => {
        if (!isConnected) {
            showToast({ message: 'Please connect your wallet first.', type: 'error', duration: 3000 });
            return;
        }

        dispatch({ type: 'SET_MINT_STATUS', payload: 'minting' });
        showToast({ message: 'Requesting transaction confirmation...', type: 'loading' });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        showToast({ message: 'Minting on Base Testnet... This may take a moment.', type: 'loading' });

        const result = await mintTagID(state.tagName);
        
        // Simulating the transaction time on the blockchain
        await new Promise(resolve => setTimeout(resolve, 2500));

        if (result.success) {
            hideToast();
            dispatch({ type: 'SET_TOKEN_URI', payload: result.tokenURI });
            dispatch({ type: 'SET_MINT_STATUS', payload: 'success' });
        } else {
            dispatch({ type: 'SET_MINT_STATUS', payload: 'error' });
            showToast({ message: 'Minting failed. Please try again.', type: 'error', duration: 4000 });
            // Reset to allow user to try again
            setTimeout(() => {
                dispatch({ type: 'SET_MINT_STATUS', payload: 'idle' });
            }, 4000);
        }
    };

    const getButtonText = () => {
        if (!isConnected) return 'Connect Wallet to Mint';
        if (state.mintStatus === 'minting') return 'Minting...';
        return 'Pay & Mint TAG ID';
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold">Mint Your TAG ID</h2>
                 <p className="text-gray-400 mt-2 max-w-md mx-auto">
                    {isReadyToMint
                        ? "This is the final step. Review your unique, soulbound TAG ID below. Once minted, it's permanently yours on the Base network."
                        : "Please complete all previous steps to enable minting. You can preview your card as you go."
                    }
                </p>
            </div>
            
            <div className="w-full max-w-sm my-4">
              <TagIdCard state={state} isGlassmorphism={true} />
            </div>

            <div className="w-full pt-4 max-w-sm">
                <Button 
                    onClick={isConnected ? handleMint : connectWallet} 
                    isLoading={state.mintStatus === 'minting'} 
                    disabled={state.mintStatus === 'minting' || state.mintStatus === 'error' || (isConnected && !isReadyToMint)}
                    className="w-full"
                >
                    {getButtonText()}
                </Button>
            </div>
        </div>
    );
};

export default MintScreen;