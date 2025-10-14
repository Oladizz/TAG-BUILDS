import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useToast } from './ToastContext';

// FIX: Add type definition for window.ethereum to resolve TypeScript errors.
interface Eip1193Provider {
    // FIX: Make the request method generic to allow typed responses.
    request: <T>(args: { method: string; params?: unknown[] | object }) => Promise<T>;
    on: (eventName: string, listener: (...args: any[]) => void) => void;
    removeListener: (eventName: string, listener: (...args: any[]) => void) => void;
}
  
declare global {
    interface Window {
      ethereum?: Eip1193Provider;
    }
}

// Base Sepolia Testnet configuration
const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_SEPOLIA_HEX_CHAIN_ID = '0x' + BASE_SEPOLIA_CHAIN_ID.toString(16); // 0x14a34
const BASE_SEPOLIA_NETWORK_PARAMS = {
    chainId: BASE_SEPOLIA_HEX_CHAIN_ID,
    chainName: 'Base Sepolia Testnet',
    nativeCurrency: {
        name: 'Sepolia Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: ['https://sepolia.base.org'],
    blockExplorerUrls: ['https://sepolia.basescan.org'],
};


interface WalletState {
    isConnected: boolean;
    walletAddress: string | null;
}

interface WalletContextType extends WalletState {
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<WalletState>({
        isConnected: false,
        walletAddress: null,
    });
    const { showToast, hideToast } = useToast();

    const handleAccountsChanged = useCallback((accounts: string[]) => {
        if (accounts.length === 0) {
            // Wallet is locked or user has disconnected all accounts
            console.log('Please connect to your wallet.');
            setState({ isConnected: false, walletAddress: null });
            showToast({ message: 'Wallet disconnected.', type: 'info', duration: 3000 });
        } else if (accounts[0] !== state.walletAddress) {
            setState({ isConnected: true, walletAddress: accounts[0] });
             showToast({ message: 'Account switched successfully.', type: 'success', duration: 2000 });
        }
    }, [state.walletAddress, showToast]);

    const handleChainChanged = useCallback(() => {
        showToast({ message: 'Network changed. Reloading app...', type: 'info', duration: 2000 });
        // Reloading the page is a simple and effective way to handle network changes.
        window.location.reload();
    }, [showToast]);

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            // Check if already connected
            const checkConnection = async () => {
                const accounts = await window.ethereum.request<string[]>({ method: 'eth_accounts' });
                if (accounts && accounts.length > 0) {
                    setState({ isConnected: true, walletAddress: accounts[0] });
                }
            };
            checkConnection();
        }

        return () => {
            if (typeof window.ethereum !== 'undefined' && window.ethereum.removeListener) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [handleAccountsChanged, handleChainChanged]);

    const checkAndSwitchNetwork = async (): Promise<boolean> => {
        // FIX: Add a guard to ensure window.ethereum exists before using it.
        if (!window.ethereum) {
            return false;
        }
        try {
            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (currentChainId !== BASE_SEPOLIA_HEX_CHAIN_ID) {
                 showToast({ message: 'Requesting to switch to Base Sepolia...', type: 'loading' });
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: BASE_SEPOLIA_HEX_CHAIN_ID }],
                    });
                     hideToast();
                } catch (switchError: any) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [BASE_SEPOLIA_NETWORK_PARAMS],
                        });
                    } else {
                        throw switchError;
                    }
                }
            }
            return true;
        } catch (error) {
            console.error('Failed to switch network:', error);
            showToast({ message: 'Failed to switch to Base Sepolia.', type: 'error', duration: 4000 });
            return false;
        }
    };


    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum === 'undefined') {
            showToast({ message: 'Please install a web3 wallet (e.g., Coinbase Wallet).', type: 'error', duration: 5000 });
            return;
        }

        showToast({ message: 'Connecting to wallet...', type: 'loading' });

        try {
            const accounts = await window.ethereum.request<string[]>({ method: 'eth_requestAccounts' });

            if (accounts && accounts.length > 0) {
                hideToast();
                const networkSwitched = await checkAndSwitchNetwork();
                if (networkSwitched) {
                     setState({
                        isConnected: true,
                        walletAddress: accounts[0],
                    });
                    showToast({ message: 'Wallet connected successfully!', type: 'success', duration: 2000 });
                }
            }
        } catch (error: any) {
            hideToast();
            if (error.code === 4001) { // EIP-1193 userRejectedRequest error
                showToast({ message: 'Connection request rejected.', type: 'info', duration: 3000 });
            } else {
                console.error(error);
                showToast({ message: 'Failed to connect wallet.', type: 'error', duration: 3000 });
            }
        }
    }, [showToast, hideToast]);

    const disconnectWallet = useCallback(() => {
        // For injected providers, we can't truly "disconnect".
        // The best we can do is clear our app's state. The user must disconnect from their wallet extension.
        setState({
            isConnected: false,
            walletAddress: null,
        });
        showToast({ message: 'Disconnected from app.', type: 'info', duration: 2000 });
    }, [showToast]);

    return (
        <WalletContext.Provider value={{ ...state, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = (): WalletContextType => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};