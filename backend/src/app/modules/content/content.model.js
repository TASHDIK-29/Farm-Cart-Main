import { Schema, model } from 'mongoose';

const contentSchema = new Schema(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  },
  { timestamps: true }
);

export const Content = model('Content', contentSchema);
