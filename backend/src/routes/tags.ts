import { Router } from 'express';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../contract';
import Tag from '../models/Tag';
import fs from 'fs';
import path from 'path';

const router = Router();

// POST /api/check-name
router.post('/check-name', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const isAvailable = await contract.isNameAvailable(name);

    res.json({ available: isAvailable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/register-name
router.post('/register-name', async (req, res) => {
  const { walletAddress, tagIdState } = req.body;

  if (!walletAddress || !tagIdState) {
    return res.status(400).json({ error: 'Wallet address and tagIdState are required' });
  }

  try {
    const existingTag = await Tag.findOne({ walletAddress });

    if (existingTag) {
      // Update existing tag
      existingTag.set(tagIdState);
      await existingTag.save();
      res.json({ success: true, tag: existingTag });
    } else {
      // Create new tag
      const newTag = new Tag({
        walletAddress,
        ...tagIdState,
      });
      await newTag.save();
      res.json({ success: true, tag: newTag });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/mint
router.post('/mint', async (req, res) => {
  const { walletAddress, name, imageData } = req.body;
  console.log('Mint request received:', { walletAddress, name });

  if (!walletAddress || !name) {
    console.log('Missing wallet address or name');
    return res.status(400).json({ error: 'Wallet address and name are required' });
  }

  try {
    // Save the image
    const imageDataBuffer = Buffer.from(imageData.replace(/^data:image\/png;base64,/, ""), 'base64');
    const imageName = `${name.replace('.tag', '')}-${Date.now()}.png`;
    const imagePath = path.join(__dirname, '../../public/uploads', imageName);
    fs.mkdirSync(path.dirname(imagePath), { recursive: true });
    fs.writeFileSync(imagePath, imageDataBuffer);

    console.log('Creating provider...');
    const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
    console.log('Provider created.');

    console.log('Creating signer...');
    const signer = new ethers.Wallet(process.env.BACKEND_SIGNER_PRIVATE_KEY || '', provider);
    console.log('Signer created.');

    console.log('Creating contract instance...');
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log('Contract instance created.');

    console.log('Calling mintTagID function...');
    const tx = await contract.mintTagID(walletAddress, name);
    console.log('mintTagID function called, transaction hash:', tx.hash);

    console.log('Waiting for transaction to be mined...');
    const receipt = await tx.wait();
    console.log('Transaction mined.');

    const tokenId = receipt.logs[0].topics[3];

    res.json({ success: true, mintHash: tx.hash, tokenId: tokenId, imagePath: `/uploads/${imageName}` });
  } catch (error) {
    console.error('Error in mint endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /api/user/:walletAddress
router.get('/user/:walletAddress', async (req, res) => {
  const { walletAddress } = req.params;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    const tag = await Tag.findOne({ walletAddress });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tag/:tagName
router.get('/tag/:tagName', async (req, res) => {
  const { tagName } = req.params;

  if (!tagName) {
    return res.status(400).json({ error: 'Tag name is required' });
  }

  try {
    const tag = await Tag.findOne({ tagName });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;