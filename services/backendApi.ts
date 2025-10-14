import { TagIdState } from '../types';
import { mockGetTagIdByWallet, mockSaveUserProfile, mockSearchTagId } from './mockApi';

/**
 * Saves the user's profile data, including their TagIdState and wallet address, to the backend.
 * @param profileData - An object containing the user's state and wallet address.
 * @returns A promise that resolves to an object indicating success.
 */
export const saveUserProfile = (profileData: {
    tagIdState: Partial<TagIdState>;
    walletAddress: string;
}): Promise<{ success: boolean }> => {
    return mockSaveUserProfile(profileData);
};

/**
 * Searches for a TAG ID by its name (e.g., "kyra.tag") via the backend.
 * @param tagName - The tag name to search for.
 * @returns A promise that resolves to the TagIdState if found, or null otherwise.
 */
export const searchTagIdByTagName = (tagName: string): Promise<TagIdState | null> => {
    return mockSearchTagId(tagName);
};

/**
 * Retrieves a TAG ID associated with a specific wallet address from the backend.
 * @param walletAddress - The wallet address to look up.
 * @returns A promise that resolves to the TagIdState if an associated ID exists, or null.
 */
export const getTagIdByWalletAddress = (walletAddress: string): Promise<TagIdState | null> => {
    return mockGetTagIdByWallet(walletAddress);
};
