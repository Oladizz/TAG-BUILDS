import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { useTagId } from '../../context/TagIdContext';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../context/ToastContext';
import { mintTagID } from '../../services/backendApi';
import { Button } from '../ui/Button';
import TagIdCard from '../TagIdCard';

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 1 0 0-2v-3a1 1 0 0 0-1-1H9Z" clipRule="evenodd" />
    </svg>
);

interface MintScreenProps {
    setAppStatus: (status: 'wizard' | 'explorer') => void;
}

const MintScreen: React.FC<MintScreenProps> = ({ setAppStatus }) => {
    const { state, dispatch } = useTagId();
    const { walletAddress, isConnected, connectWallet } = useWallet();
    const { showToast, hideToast } = useToast();
    const cardRef = useRef<HTMLDivElement>(null);
    const [duration, setDuration] = useState(1);
    
    const isReadyToMint = !!state.tagName && state.isAvailable === true && state.isHuman && !!state.legalInfo.name;

    const calculateMintPrice = (tagName: string, duration: number): string => {
        if (!tagName) return (0.005 * Math.pow(2, duration - 1)).toFixed(4);
        const nameLength = tagName.replace('.tag', '').length;
        let basePrice = 0.005;
        if (nameLength <= 2) basePrice = 0.08;
        else if (nameLength === 3) basePrice = 0.05;
        else if (nameLength === 4) basePrice = 0.02;
        
        const finalPrice = basePrice * Math.pow(2, duration - 1);
        return finalPrice.toFixed(4);
    };

    const mintPrice = calculateMintPrice(state.tagName, duration);

    const handleMint = async () => {
        if (!isConnected || !walletAddress) {
            showToast({ message: 'Please connect your wallet first.', type: 'error', duration: 3000 });
            return;
        }

        if (!cardRef.current) {
            showToast({ message: 'Card element not found.', type: 'error' });
            return;
        }

        dispatch({ type: 'SET_MINT_STATUS', payload: 'minting' });
        showToast({ message: 'Generating ID card image...', type: 'loading' });

        try {
            const node = cardRef.current;
            const scale = window.devicePixelRatio;
            const cardWidth = node.offsetWidth;
            const cardHeight = node.offsetHeight;
            const requiredHeight = cardHeight * 0.65 + 500;

            const options = {
                cacheBust: true,
                width: cardWidth * scale,
                height: requiredHeight * scale,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: `${cardWidth}px`,
                    height: `${requiredHeight}px`,
                }
            };
            const dataUrl = await toPng(node, options);
            showToast({ message: 'Requesting transaction confirmation...', type: 'loading' });

            const result = await mintTagID(walletAddress, state.tagName, dataUrl);

            if (result.success) {
                hideToast();
                const tokenURI = `https://tag.id/api/metadata/${result.tokenId}`;
                dispatch({ type: 'SET_TOKEN_URI', payload: tokenURI });
                dispatch({ type: 'SET_MINT_STATUS', payload: 'success' });
            } else {
                dispatch({ type: 'SET_MINT_STATUS', payload: 'error' });
                showToast({ message: 'Minting failed. Please try again.', type: 'error', duration: 4000 });
                setTimeout(() => {
                    dispatch({ type: 'SET_MINT_STATUS', payload: 'idle' });
                }, 4000);
            }
        } catch (error) {
            console.error('Minting error:', error);
            dispatch({ type: 'SET_MINT_STATUS', payload: 'error' });
            showToast({ message: 'An unexpected error occurred during minting.', type: 'error', duration: 4000 });
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

    const handleDownload = async () => {
        if (!cardRef.current) {
            showToast({ message: 'Card element not found.', type: 'error' });
            return;
        }

        showToast({ message: 'Generating image for download...', type: 'loading' });

        try {
            const node = cardRef.current;
            const scale = window.devicePixelRatio;
            const cardWidth = node.offsetWidth;
            const cardHeight = node.offsetHeight;
            const requiredHeight = cardHeight * 0.65 + 500;

            const options = {
                cacheBust: true,
                width: cardWidth * scale,
                height: requiredHeight * scale,
                style: {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: `${cardWidth}px`,
                    height: `${requiredHeight}px`,
                }
            };
            const dataUrl = await toPng(node, options);
            const link = document.createElement('a');
            link.download = 'tag-id-card.png';
            link.href = dataUrl;
            link.click();
            hideToast();
        } catch (error) {
            console.error('Failed to generate image:', error);
            showToast({ message: 'Failed to generate image.', type: 'error' });
        }
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
            
            <div className="w-full max-w-lg my-4" ref={cardRef}>
              <TagIdCard state={state} isGlassmorphism={true} />
            </div>

            <div className="w-full max-w-sm">
                <label htmlFor="duration-slider" className="block text-sm font-medium text-gray-400 mb-2">
                    Registration Duration: {duration * 6} months
                </label>
                <input
                    id="duration-slider"
                    type="range"
                    min="1"
                    max="4"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>6m</span>
                    <span>12m</span>
                    <span>18m</span>
                    <span>24m</span>
                </div>
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
                <div className="flex flex-col space-y-4">
                    <Button 
                        onClick={isConnected ? handleMint : connectWallet} 
                        isLoading={state.mintStatus === 'minting'} 
                        disabled={state.mintStatus === 'minting' || state.mintStatus === 'error' || (isConnected && !isReadyToMint)}
                        className="w-full"
                    >
                        {getButtonText()}
                    </Button>
                    <Button 
                        onClick={handleDownload} 
                        variant="secondary"
                        className="w-full"
                    >
                        Download Card Image
                    </Button>
                </div>
            </div>


        </div>
    );
};

export default MintScreen;
