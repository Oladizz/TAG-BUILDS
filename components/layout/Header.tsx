import React from 'react';
import { NAV_ITEMS } from '../../constants';
import type { Tab } from '../App';
import { Button } from '../ui/Button';
import { TagIcon } from '../icons/TagIcon';
import { useWallet } from '../../context/WalletContext';

interface HeaderProps {
    activeTab: Tab;
    onLogoClick: () => void;
}

const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Header: React.FC<HeaderProps> = ({ activeTab, onLogoClick }) => {
    const { isConnected, walletAddress, connectWallet } = useWallet();

    const activeNavItem = NAV_ITEMS.find(item => item.id === activeTab);
    const title = activeNavItem?.title || 'TAG';
    const stepIndex = NAV_ITEMS.findIndex(item => item.id === activeTab);
    const currentStep = stepIndex !== -1 ? stepIndex + 1 : 1;

    return (
        <header className="absolute top-0 left-0 right-0 z-20 mx-4 mt-4 rounded-2xl bg-black/50 backdrop-blur-lg border border-white/10 p-4 flex justify-between items-center shadow-xl shadow-green-500/20">
            <button
                onClick={onLogoClick}
                className="flex items-center space-x-3 text-left rounded-lg p-1 -m-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400/80 transition-shadow"
                aria-label="Go to homepage"
            >
                <TagIcon className="w-8 h-8 rounded-md" />
                 <div>
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-300">
                       {title}
                   </h1>
                   <p className="text-xs text-gray-400 font-medium -mt-0.5">{`Step ${currentStep} of ${NAV_ITEMS.length}`}</p>
                </div>
            </button>
            <Button variant='secondary' size="small" onClick={!isConnected ? connectWallet : undefined}>
                {isConnected && walletAddress ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_theme(colors.green.400)]"></div>
                        <span>{truncateAddress(walletAddress)}</span>
                    </div>
                ) : (
                    'Connect Wallet'
                )}
            </Button>
        </header>
    );
};

export default Header;