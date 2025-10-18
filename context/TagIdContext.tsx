import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import type { TagIdState, Action } from '../types';

// This is the state for a new user, or after resetting.
const emptyState: TagIdState = {
    tagName: "",
    isAvailable: null,
    isHuman: false,
    legalInfo: { name: "", idCategory: "", idNumber: "", dob: "", nationality: "" },
    socials: [],
    pfp: "",
    bio: "",
    skills: [],
    isProfileSaved: false,
    mintStatus: "idle",
    tokenURI: "",
};


// --- MOCK DATA FOR TESTING ---
const mockState: TagIdState = {
    tagName: "gemini-builder.tag",
    isAvailable: true,
    isHuman: true,
    legalInfo: {
        name: "Gemini Builder",
        idCategory: "passport",
        idNumber: "T12345678",
        dob: "1995-05-15",
        nationality: "United States"
    },
    socials: [
        { id: '1', url: 'https://twitter.com/kyra_builds' },
        { id: '2', url: 'https://github.com/kyra-dev' },
    ],
    pfp: "https://i.postimg.cc/wx5yYHNx/IMG-20251015-001843-944.jpg",
    bio: "Onchain identity enthusiast, building the future on Base. Exploring decentralized systems and creating cool things.",
    skills: ["Developer", "Web3 Enthustiast", "Blockchain dev", "Solidity development"],
    isProfileSaved: true,
    mintStatus: "idle",
    tokenURI: "",
};
// --- END MOCK DATA ---


const initialState: TagIdState = emptyState;

const TagIdContext = createContext<{
    state: TagIdState;
    dispatch: Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => null,
});

const tagIdReducer = (state: TagIdState, action: Action): TagIdState => {
    switch (action.type) {
        case 'SET_TAG_NAME':
            // When name changes, profile is no longer "saved" in its current state
            return { ...state, tagName: action.payload, isProfileSaved: false };
        case 'SET_AVAILABILITY':
            return { ...state, isAvailable: action.payload };
        case 'SET_IS_HUMAN':
            return { ...state, isHuman: action.payload };
        case 'SET_LEGAL_INFO':
            return { ...state, legalInfo: { ...state.legalInfo, ...action.payload }, isProfileSaved: false };
        case 'SET_SOCIALS':
            return { ...state, socials: action.payload, isProfileSaved: false };
        case 'SET_PFP':
            return { ...state, pfp: action.payload, isProfileSaved: false };
        case 'SET_BIO':
            return { ...state, bio: action.payload, isProfileSaved: false };
        case 'SET_SKILLS':
            return { ...state, skills: action.payload, isProfileSaved: false };
        case 'SET_PROFILE_SAVED':
            return { ...state, isProfileSaved: action.payload };
        case 'SET_MINT_STATUS':
            return { ...state, mintStatus: action.payload };
        case 'SET_TOKEN_URI':
            return { ...state, tokenURI: action.payload };
        case 'SET_FULL_STATE':
            return { ...action.payload };
        case 'RESET_STATE':
            return emptyState;
        default:
            return state;
    }
};

export const TagIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(tagIdReducer, initialState);
    
    // NOTE: Local storage persistence is temporarily disabled for testing with mock data.

    return (
        <TagIdContext.Provider value={{ state, dispatch }}>
            {children}
        </TagIdContext.Provider>
    );
};

export const useTagId = () => useContext(TagIdContext);