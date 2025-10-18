import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../src/contract';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
    const signer = new ethers.Wallet(process.env.BACKEND_SIGNER_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const walletAddress = '0xf68f2973d5347a8a27ee3be0618c37b52c846d50';
    const randomNumber = Math.floor(Math.random() * 1000000);
    const tagName = `gemini-builder-${randomNumber}.tag`;

    try {
        console.log(`Checking availability of '${tagName}'...`);
        const isAvailable = await contract.isNameAvailable(tagName);
        console.log(`Is '${tagName}' available? ${isAvailable}`);

        if (isAvailable) {
            console.log(`Minting '${tagName}' for ${walletAddress}...`);
            const tx = await contract.mintTagID(walletAddress, tagName);
            console.log('Transaction sent:', tx.hash);
            const receipt = await tx.wait();
            console.log('Transaction mined:');
            console.log(receipt);
            const tokenId = receipt.logs[0].topics[3];
            console.log(`Token ID: ${tokenId}`);
        } else {
            console.log(`'${tagName}' is not available. Please try running the script again.`);
        }
    } catch (error) {
        console.error('Minting failed:', error);
    }
}

main().catch(console.error);
