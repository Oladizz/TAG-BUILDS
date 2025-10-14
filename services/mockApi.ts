import { TagIdState } from "../types";

// --- MOCK DATABASE ---
let MOCK_USER_DB: { walletAddress: string, tagIdState: TagIdState }[] = [];


// This function mocks an API call to a verification service.
export const verifyIdentity = async (data: any): Promise<{ verified: boolean }> => {
    console.log("Mock verification called with:", data);
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ verified: true });
        }, 1500); // Simulate network delay
    });
};

// This function mocks a biometric verification process.
export const verifyBiometrics = async (): Promise<{ success: boolean }> => {
    console.log("Mock biometrics verification called");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ success: true });
        }, 2000); // Simulate sensor reading and verification
    });
};

// This function now makes a real API call to a geolocation service.
// This simulates how a backend would determine location via IP address for accuracy.
export const getGeolocationInfo = async (): Promise<{ nationality: string }> => {
    console.log("Real geolocation lookup called");
    try {
        // Switched to a more reliable geolocation API with permissive CORS policies to prevent fetch errors.
        const response = await fetch('https://get.geojs.io/v1/ip/country.json');
        if (!response.ok) {
            throw new Error(`Geolocation service responded with status: ${response.status}`);
        }
        const data = await response.json();
        
        // The new API returns the full country name in the 'name' field.
        if (data && data.name) {
            return { nationality: data.name };
        } else {
            throw new Error('Invalid response from geolocation service.');
        }
    } catch (error) {
        console.error("Geolocation API error:", error);
        // Fallback to a default value in case of API failure (e.g., ad-blockers, network issues)
        return { nationality: 'Not Detected' };
    }
};


// --- NEW BACKEND MOCK FUNCTIONS ---

/**
 * Mocks saving user profile data to a database.
 * @param profileData - The user's tag ID state and wallet address.
 */
export const mockSaveUserProfile = async (profileData: {
    tagIdState: Partial<TagIdState>;
    walletAddress: string;
}): Promise<{ success: boolean }> => {
    console.log("Saving user profile for", profileData.walletAddress, profileData);
    return new Promise(resolve => {
        setTimeout(() => {
            const existingUserIndex = MOCK_USER_DB.findIndex(
                (user) => user.walletAddress === profileData.walletAddress
            );

            const userRecord = {
                walletAddress: profileData.walletAddress,
                tagIdState: profileData.tagIdState as TagIdState,
            };

            if (existingUserIndex > -1) {
                MOCK_USER_DB[existingUserIndex] = userRecord;
            } else {
                MOCK_USER_DB.push(userRecord);
            }
            console.log("Current DB:", MOCK_USER_DB);
            resolve({ success: true });
        }, 1500); // Simulate network delay
    });
};

/**
 * Mocks searching for a TAG ID by its name in the database.
 * @param tagName - The tag name to search for.
 */
export const mockSearchTagId = async (tagName: string): Promise<TagIdState | null> => {
    console.log(`Searching for tag name: ${tagName}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const result = MOCK_USER_DB.find(
                (user) => user.tagIdState.tagName.toLowerCase() === tagName.toLowerCase()
            );
            resolve(result ? result.tagIdState : null);
        }, 1200);
    });
};

/**
 * Mocks retrieving a TAG ID by the owner's wallet address.
 * @param walletAddress - The wallet address to look up.
 */
export const mockGetTagIdByWallet = async (walletAddress: string): Promise<TagIdState | null> => {
    console.log(`Getting TAG ID for wallet: ${walletAddress}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const result = MOCK_USER_DB.find(
                (user) => user.walletAddress.toLowerCase() === walletAddress.toLowerCase() && user.tagIdState.mintStatus === 'success'
            );
            resolve(result ? result.tagIdState : null);
        }, 1000);
    });
};