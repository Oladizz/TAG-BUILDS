import { TagIdState } from '../types';

const API_URL = '/api';

/**
 * Saves the user's profile data, including their TagIdState and wallet address, to the backend.
 * @param profileData - An object containing the user's state and wallet address.
 * @returns A promise that resolves to an object indicating success.
 */
export const saveUserProfile = async (profileData: {
    tagIdState: Partial<TagIdState>;
    walletAddress: string;
}): Promise<{ success: boolean }> => {
    const response = await fetch(`${API_URL}/register-name`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    });
    return response.json();
};

/**
 * Searches for a TAG ID by its name (e.g., "kyra.tag") via the backend.
 * @param tagName - The tag name to search for.
 * @returns A promise that resolves to the TagIdState if found, or null otherwise.
 */
export const searchTagIdByTagName = async (tagName: string): Promise<TagIdState | null> => {
    const response = await fetch(`${API_URL}/tag/${tagName}`);
    if (response.status === 404) {
        return null;
    }
    return response.json();
};

/**
 * Retrieves a TAG ID associated with a specific wallet address from the backend.
 * @param walletAddress - The wallet address to look up.
 * @returns A promise that resolves to the TagIdState if an associated ID exists, or null.
 */
export const getTagIdByWalletAddress = async (walletAddress: string): Promise<TagIdState | null> => {
    const response = await fetch(`${API_URL}/user/${walletAddress}`);
    if (response.status === 404) {
        return null;
    }
    return response.json();
};

export const mintTagID = async (walletAddress: string, name: string, imageData: string): Promise<{ success: boolean, mintHash: string, tokenId: string }> => {
    const response = await fetch(`${API_URL}/mint`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, name, imageData }),
    });
    return response.json();
};

/**
 * Checks if a TAG name is available on the smart contract via the backend.
 * @param name - The tag name to check.
 * @returns A promise that resolves to a boolean indicating availability.
 */
export const checkTagNameAvailability = async (name: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/check-name`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
    const data = await response.json();
    return data.available;
};