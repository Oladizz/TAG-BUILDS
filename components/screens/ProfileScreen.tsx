import React, { useEffect, useState } from 'react';
import { useTagId } from '../../context/TagIdContext';
import { useWallet } from '../../context/WalletContext';
import { Input } from '../ui/Input';
import { detectPlatform, getPlatformIcon } from '../icons/SocialIcons';
import type { Tab } from '../App';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { getGeolocationInfo } from '../../services/mockApi';
import { saveUserProfile } from '../../services/backendApi';

const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m15-3a3 3 0 1 1-6 0m6 0a3 3 0 1 1-6 0" />
    </svg>
);
const ClipboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.218V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.342c0-1.141.806-2.09 1.907-2.218a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
);
const ClipboardCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.218V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.342c0-1.141.806-2.09 1.907-2.218a48.208 48.208 0 0 1 1.927-.184" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3 3-3M9 15.75s-3-3-3-3" />
    </svg>
);

const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
);

const LockClosedIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
);

interface ProfileScreenProps {
    setActiveTab: (tab: Tab) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ setActiveTab }) => {
    const { state, dispatch } = useTagId();
    const { isConnected, walletAddress } = useWallet();
    const { showToast, hideToast } = useToast();
    const [copied, setCopied] = useState(false);
    const [isFetchingNationality, setIsFetchingNationality] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchNationality = async () => {
            if (!state.legalInfo.nationality) {
                setIsFetchingNationality(true);
                try {
                    const data = await getGeolocationInfo();
                    dispatch({ type: 'SET_LEGAL_INFO', payload: { nationality: data.nationality } });
                } catch (error) {
                    console.error("Failed to fetch nationality", error);
                    showToast({ message: 'Could not auto-detect nationality.', type: 'error' });
                } finally {
                    setIsFetchingNationality(false);
                }
            }
        };

        fetchNationality();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const handleLegalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'SET_LEGAL_INFO',
            payload: { [e.target.name]: e.target.value }
        });
    };
    
    const handleAddSocial = () => {
        if (state.socials.length < 7) {
            const newSocials = [...state.socials, { id: crypto.randomUUID(), url: '' }];
            dispatch({ type: 'SET_SOCIALS', payload: newSocials });
        }
    };

    const handleUpdateSocial = (id: string, url: string) => {
        const newSocials = state.socials.map(s => s.id === id ? { ...s, url } : s);
        dispatch({ type: 'SET_SOCIALS', payload: newSocials });
    };

    const handleRemoveSocial = (id: string) => {
        const newSocials = state.socials.filter(s => s.id !== id);
        dispatch({ type: 'SET_SOCIALS', payload: newSocials });
    };


    const handlePfpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch({ type: 'SET_PFP', payload: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCopyAddress = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress);
            setCopied(true);
            showToast({ message: 'Address copied!', type: 'success', duration: 1500 });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSaveProfile = async () => {
        if (!walletAddress) {
            showToast({ message: 'Please connect your wallet to save.', type: 'error' });
            return;
        }
        setIsSaving(true);
        showToast({ message: 'Saving profile to backend...', type: 'loading' });
        try {
            const result = await saveUserProfile({ tagIdState: state, walletAddress });
            if (result.success) {
                dispatch({ type: 'SET_PROFILE_SAVED', payload: true });
                showToast({ message: 'Profile saved successfully!', type: 'success' });
                setTimeout(() => setActiveTab('mint'), 1000);
            } else {
                throw new Error('Backend save failed');
            }
        } catch (error) {
            showToast({ message: 'Failed to save profile. Please try again.', type: 'error' });
        } finally {
            setIsSaving(false);
            hideToast();
        }
    };
    
    const isProfileDataComplete = !!state.legalInfo.name && !!state.legalInfo.dob && !!state.legalInfo.nationality;

    return (
        <div className="flex flex-col space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Build Your Profile</h2>
                <p className="text-gray-400 mt-1">This information will be displayed on your TAG ID.</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
                <div className="relative w-24 h-24">
                    <div className="w-full h-full rounded-full bg-gray-800 border-2 border-white/20 overflow-hidden shadow-lg shadow-green-500/30">
                        {state.pfp ? (
                            <img src={state.pfp} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                        )}
                    </div>
                     <label htmlFor="pfp-upload" className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black cursor-pointer border-2 border-black hover:bg-green-400 transition-colors">
                        <CameraIcon className="w-5 h-5" />
                     </label>
                     <input id="pfp-upload" type="file" accept="image/*" onChange={handlePfpUpload} className="hidden"/>
                </div>
                <p className="text-xs text-gray-500 pt-1">Upload a profile picture</p>
            </div>
            
            {isConnected && walletAddress && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-300">Connected Wallet</h3>
                    <div className="relative group">
                        <div className="flex items-center w-full bg-black/20 border-2 border-white/10 rounded-lg py-3 text-white focus:outline-none transition-all duration-300 pl-10 pr-4">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <WalletIcon className="w-5 h-5" />
                            </div>
                            <span className="truncate">{walletAddress}</span>
                        </div>
                        <button onClick={handleCopyAddress} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-green-400 transition-colors rounded-md hover:bg-white/10">
                            {copied ? <ClipboardCheckIcon className="w-5 h-5 text-green-400"/> : <ClipboardIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>
            )}
            
            <div className="space-y-4">
                 <h3 className="font-semibold text-gray-300">Legal Details</h3>
                <Input label="Full Name" name="name" value={state.legalInfo.name} onChange={handleLegalChange} />
                <Input label="Date of Birth" name="dob" type="date" value={state.legalInfo.dob} onChange={handleLegalChange} />
                 <div className="relative group">
                    <Input
                        label="Nationality"
                        name="nationality"
                        value={isFetchingNationality ? "Detecting..." : state.legalInfo.nationality}
                        onChange={() => {}} // No-op as it's disabled
                        disabled={true}
                        icon={<LockClosedIcon className="w-5 h-5 text-gray-500" />}
                    />
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-gray-900 border border-white/10 rounded-lg text-xs text-center text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Your nationality is automatically detected to ensure authenticity and cannot be changed.
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-300">Social Links (up to 7)</h3>
                    <Button 
                        variant="secondary" 
                        onClick={handleAddSocial} 
                        disabled={state.socials.length >= 7}
                        size="small"
                    >
                        Add
                    </Button>
                </div>
                {state.socials.map((social) => (
                    <div key={social.id} className="flex items-center space-x-2">
                        <Input 
                            label="Enter profile URL" 
                            name="social" 
                            value={social.url} 
                            onChange={(e) => handleUpdateSocial(social.id, e.target.value)} 
                            icon={getPlatformIcon(detectPlatform(social.url))}
                            className="flex-grow"
                        />
                        <button 
                            onClick={() => handleRemoveSocial(social.id)} 
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                            aria-label="Remove social link"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
                {state.socials.length === 0 && (
                     <div className="text-center text-sm text-gray-500 py-4 border-2 border-dashed border-white/10 rounded-lg shadow-inner shadow-green-500/10">
                        <p>No social links added yet.</p>
                     </div>
                )}
            </div>
            
            <div className="pt-4">
                 <Button
                    onClick={handleSaveProfile}
                    isLoading={isSaving}
                    disabled={isSaving || !isProfileDataComplete || state.isProfileSaved}
                    className="w-full"
                >
                    {state.isProfileSaved ? 'Profile Saved' : 'Save Profile & Continue'}
                </Button>
            </div>
        </div>
    );
};

export default ProfileScreen;