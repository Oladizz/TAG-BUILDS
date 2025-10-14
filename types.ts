
export interface LegalInfo {
    name: string;
    dob: string;
    nationality: string;
}

export interface SocialLink {
    id: string; // Used for React keys
    url: string;
}

export type MintStatus = 'idle' | 'minting' | 'success' | 'error';

export interface TagIdState {
    tagName: string;
    isAvailable: boolean | null;
    isHuman: boolean;
    legalInfo: LegalInfo;
    fingerprintVerified: boolean;
    socials: SocialLink[];
    pfp: string; // Will store a data URL or a mock URL
    isProfileSaved: boolean;
    mintStatus: MintStatus;
    tokenURI: string;
}

export type Action =
    | { type: 'SET_TAG_NAME'; payload: string }
    | { type: 'SET_AVAILABILITY'; payload: boolean | null }
    | { type: 'SET_IS_HUMAN'; payload: boolean }
    | { type: 'SET_LEGAL_INFO'; payload: Partial<LegalInfo> }
    | { type: 'SET_FINGERPRINT_VERIFIED'; payload: boolean }
    | { type: 'SET_SOCIALS'; payload: SocialLink[] }
    | { type: 'SET_PFP'; payload: string }
    | { type: 'SET_PROFILE_SAVED'; payload: boolean }
    | { type: 'SET_MINT_STATUS'; payload: MintStatus }
    | { type: 'SET_TOKEN_URI'; payload: string }
    | { type: 'SET_FULL_STATE'; payload: TagIdState }
    | { type: 'RESET_STATE' };

export interface StepProps {
    onNext: () => void;
    onBack: () => void;
}
