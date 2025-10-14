import type { TagIdState } from "./types";
import { IdCardIcon, ShieldCheckIcon, UserCircleIcon, SparklesIcon } from "./components/icons/NavIcons";

export const NAV_ITEMS = [
    {
        id: 'id',
        title: 'ID',
        icon: IdCardIcon,
        isComplete: (state: TagIdState) => !!state.tagName && state.isAvailable === true,
    },
    {
        id: 'verify',
        title: 'Verify',
        icon: ShieldCheckIcon,
        isComplete: (state: TagIdState) => state.isHuman && state.fingerprintVerified,
    },
    {
        id: 'profile',
        title: 'Profile',
        icon: UserCircleIcon,
        isComplete: (state: TagIdState) => state.isProfileSaved,
    },
    {
        id: 'mint',
        title: 'Mint',
        icon: SparklesIcon,
        isComplete: (state: TagIdState) => state.mintStatus === 'success',
        // The isDisabled property has been removed to make the Mint tab always clickable.
        // The MintScreen component itself will handle disabling the final mint button if steps are incomplete.
    },
];
