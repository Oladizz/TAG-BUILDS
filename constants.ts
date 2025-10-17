import type { TagIdState } from "./types";
import { IdCardIcon, ShieldCheckIcon, UserCircleIcon, SparklesIcon } from "./components/icons/NavIcons";

export const NAV_ITEMS = [
    {
        id: 'id',
        title: 'ID',
        icon: IdCardIcon,
        isComplete: (state: TagIdState) => !!state.tagName && state.isAvailable === true,
        isDisabled: (state: TagIdState) => false,
    },
    {
        id: 'verify',
        title: 'Verify',
        icon: ShieldCheckIcon,
        isComplete: (state: TagIdState) => 
            state.isHuman && 
            !!state.legalInfo.name &&
            !!state.legalInfo.idCategory &&
            !!state.legalInfo.idNumber &&
            !!state.legalInfo.dob,
        isDisabled: (state: TagIdState) => !(!!state.tagName && state.isAvailable === true),
    },
    {
        id: 'profile',
        title: 'Profile',
        icon: UserCircleIcon,
        isComplete: (state: TagIdState) => state.isProfileSaved,
        isDisabled: (state: TagIdState) => !(
            state.isHuman && 
            !!state.legalInfo.name &&
            !!state.legalInfo.idCategory &&
            !!state.legalInfo.idNumber &&
            !!state.legalInfo.dob
        ),
    },
    {
        id: 'mint',
        title: 'Mint',
        icon: SparklesIcon,
        isComplete: (state: TagIdState) => state.mintStatus === 'success',
        isDisabled: (state: TagIdState) => !state.isProfileSaved,
    },
];