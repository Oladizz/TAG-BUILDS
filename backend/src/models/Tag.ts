import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  walletAddress: string;
  tagName: string;
  isMinted: boolean;
  mintHash: string;
  pfp: string;
  bio: string;
  skills: string[];
  socials: { id: string, url: string }[];
  legalInfo: {
    name: string;
    idCategory: string;
    idNumber: string;
    dob: string;
    nationality: string;
  };
}

const TagSchema: Schema = new Schema({
  walletAddress: { type: String, required: true, unique: true },
  tagName: { type: String, required: true, unique: true },
  isMinted: { type: Boolean, default: false },
  mintHash: { type: String },
  pfp: { type: String },
  bio: { type: String },
  skills: { type: [String] },
  socials: { type: [{ id: String, url: String }] },
  legalInfo: {
    name: { type: String },
    idCategory: { type: String },
    idNumber: { type: String },
    dob: { type: String },
    nationality: { type: String },
  },
}, { timestamps: true });

export default mongoose.model<ITag>('Tag', TagSchema);
