import React, { useState } from 'react';
import { useTagId } from '../../context/TagIdContext';
import { useWallet } from '../../context/WalletContext';
import { Input } from '../ui/Input';
import { detectPlatform, getPlatformIcon } from '../icons/SocialIcons';
import type { Tab } from '../App';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { saveUserProfile } from '../../services/backendApi';


const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
    </svg>
);


const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => {
    const id = React.useId();
    const labelBgColor = '#000000';

    return (
        <div className="relative group">
            <textarea
                id={id}
                className={`peer w-full bg-black/20 border-2 rounded-lg py-3 px-4 text-white placeholder-transparent focus:outline-none transition-all duration-300 min-h-[100px] border-white/10 shadow-sm shadow-green-500/5 focus:border-green-500 focus:ring-2 focus:ring-green-500/30 focus:shadow-lg focus:shadow-green-500/20`}
                placeholder={label}
                {...props}
            />
            <label
                htmlFor={id}
                className={`absolute left-4 -top-2.5 text-xs px-1 transition-all
                           peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                           peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-green-400`}
                style={{ backgroundColor: labelBgColor }}
            >
                {label}
            </label>
        </div>
    );
};

const SKILL_TAGS = [
    "Developer", "Designer", "Writer", "Editor", "Researcher", "Analyst",
    "Product Manager", "Marketer", "Community Manager", "Strategist", "Founder",
    "Investor", "Fullstack developer", "Blockchain dev", "Smart Contracts dev",
    "Solidity development", "Web3 Enthustiast", "Data Science", "UI/UX",
    "DevOps", "Artist", "Illustrator", "Photographer", "Videographer",
    "Animator", "Content Creator", "Meme Maker", "Copywriter", "Motion Designer"
];


interface ProfileScreenProps {
    setActiveTab: (tab: Tab) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ setActiveTab }) => {
    const { state, dispatch } = useTagId();
    const { walletAddress } = useWallet();
    const { showToast, hideToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [showAllSkills, setShowAllSkills] = useState(false);

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
    
    const handleToggleSkill = (skill: string) => {
        const newSkills = state.skills.includes(skill)
            ? state.skills.filter(s => s !== skill)
            : [...state.skills, skill];
        
        if (newSkills.length <= 4) {
            dispatch({ type: 'SET_SKILLS', payload: newSkills });
        } else {
            showToast({ message: 'You can select up to 4 skills.', type: 'info', duration: 2000 });
        }
    };
    
    const isProfileDataComplete = !!state.pfp;

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
            
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-300">Short Bio</h3>
                <Textarea 
                    label="Tell us about yourself... (max 150 chars)" 
                    value={state.bio}
                    onChange={(e) => dispatch({ type: 'SET_BIO', payload: e.target.value })}
                    maxLength={150}
                />
            </div>

             <div className="space-y-4">
                <h3 className="font-semibold text-gray-300">Skills & Interests (up to 4)</h3>
                <div className="flex flex-wrap gap-2">
                    {(showAllSkills ? SKILL_TAGS : SKILL_TAGS.slice(0, 4)).map(skill => {
                        const isSelected = state.skills.includes(skill);
                        return (
                            <button
                                key={skill}
                                onClick={() => handleToggleSkill(skill)}
                                className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-all duration-200 ${
                                    isSelected 
                                    ? 'bg-green-500/20 border-green-400 text-green-300 shadow-md shadow-green-500/10' 
                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                                }`}
                            >
                                {skill}
                            </button>
                        )
                    })}
                </div>
                {SKILL_TAGS.length > 4 && (
                    <div className="mt-4 flex justify-center">
                         <Button 
                            variant="secondary" 
                            size="small" 
                            onClick={() => setShowAllSkills(!showAllSkills)}
                        >
                            {showAllSkills ? 'View Less' : `View All ${SKILL_TAGS.length} Skills`}
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-300">Social Links</h3>
                    <Button 
                        variant="secondary" 
                        onClick={handleAddSocial} 
                        disabled={state.socials.length >= 7}
                        size="small"
                    >
                        Add
                    </Button>
                </div>
                 <p className="text-xs text-gray-500 -mt-3">Link your X (Twitter), Farcaster, GitHub, Telegram, or Discord.</p>
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