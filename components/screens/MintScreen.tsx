import React from 'react';
import { useTagId } from '../../context/TagIdContext';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../context/ToastContext';
import { mintTagID } from '../../services/mockContract';
import { Button } from '../ui/Button';
import TagIdCard from '../TagIdCard';

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1H9Z" clipRule="evenodd" />
    </svg>
);

const MintScreen: React.FC = () => {
    const { state, dispatch } = useTagId();
    const { isConnected, connectWallet } = useWallet();
    const { showToast, hideToast } = useToast();
    
    const isReadyToMint = !!state.tagName && state.isAvailable === true && state.isHuman && state.fingerprintVerified && !!state.legalInfo.name;

    const calculateMintPrice = (tagName: string): string => {
        if (!tagName) return '0.005'; // Default price
        const nameLength = tagName.replace('.tag', '').length;
        if (nameLength <= 2) return '0.08';
        if (nameLength === 3) return '0.05';
        if (nameLength === 4) return '0.02';
        return '0.005'; // 5+ characters
    };

    const mintPrice = calculateMintPrice(state.tagName);

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
        return `Pay ${mintPrice} ETH & Mint`;
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

            {/* Price Display */}
            <div className="w-full max-w-sm p-4 bg-black/20 border border-white/10 rounded-xl flex justify-between items-center shadow-lg shadow-green-500/10">
                 <div className="flex items-center space-x-2">
                    <span className="text-gray-400 font-medium">Minting Fee</span>
                    <div className="relative group">
                        <InfoIcon className="w-4 h-4 text-gray-500" />
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-gray-900 border border-white/10 rounded-lg text-xs text-left text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                            <p className="font-bold mb-1">Pricing Tiers:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-semibold">2 chars or less:</span> 0.08 ETH</li>
                                <li><span className="font-semibold">3 chars:</span> 0.05 ETH</li>
                                <li><span className="font-semibold">4 chars:</span> 0.02 ETH</li>
                                <li><span className="font-semibold">5+ chars:</span> 0.005 ETH</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                     <img src="https://i.postimg.cc/FKmFxZ1P/u-b-52a61660-82d7-11ee-beed-414173dd7838.png" alt="Base Network" className="h-5"/>
                    <span className="text-white font-bold text-lg">{mintPrice} ETH</span>
                </div>
            </div>

            <div className="w-full pt-2 max-w-sm">
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