import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['farmer', 'consumer'], required: true },
    
    // Farmer-specific fields (Optional for consumers)
    businessName: { type: String },
    description: { type: String },
    averageRating: { type: Number, default: 0 },
    location: { type: String },
    profileImage: { type: String }
  },
  { timestamps: true }
);

// Pre-save middleware for password hashing
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export const User = model('User', userSchema);
