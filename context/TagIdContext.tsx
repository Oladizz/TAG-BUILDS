
import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import type { TagIdState, Action } from '../types';

const initialState: TagIdState = {
    tagName: "",
    isAvailable: null,
    isHuman: false,
    legalInfo: { name: "", dob: "", nationality: "" },
    fingerprintVerified: false,
    socials: [],
    pfp: "",
    isProfileSaved: false,
    mintStatus: "idle",
    tokenURI: "",
};

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
            return { ...state, tagName: action.payload, isAvailable: null, isProfileSaved: false };
        case 'SET_AVAILABILITY':
            return { ...state, isAvailable: action.payload };
        case 'SET_IS_HUMAN':
            return { ...state, isHuman: action.payload };
        case 'SET_LEGAL_INFO':
            return { ...state, legalInfo: { ...state.legalInfo, ...action.payload }, isProfileSaved: false };
        case 'SET_FINGERPRINT_VERIFIED':
            return { ...state, fingerprintVerified: action.payload };
        case 'SET_SOCIALS':
            return { ...state, socials: action.payload, isProfileSaved: false };
        case 'SET_PFP':
            return { ...state, pfp: action.payload, isProfileSaved: false };
        case 'SET_PROFILE_SAVED':
            return { ...state, isProfileSaved: action.payload };
        case 'SET_MINT_STATUS':
            return { ...state, mintStatus: action.payload };
        case 'SET_TOKEN_URI':
            return { ...state, tokenURI: action.payload };
        case 'SET_FULL_STATE':
            return { ...action.payload };
        case 'RESET_STATE':
            return initialState;
        default:
            return state;
    }
};

export const TagIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(tagIdReducer, initialState);
    return (
        <TagIdContext.Provider value={{ state, dispatch }}>
            {children}
        </TagIdContext.Provider>
    );
};

export const useTagId = () => useContext(TagIdContext);
