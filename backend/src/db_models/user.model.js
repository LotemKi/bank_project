import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // UUID or custom ID
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false }, // hashed password
    phone: { type: String, required: true },
    verificationStatus: { type: String, enum: ['PENDING', 'ACTIVE', 'BLOCKED'], default: 'PENDING' }, 
    verificationToken: { type: String },
    balance: { type: Number, default: 500 }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

export default mongoose.model('User', userSchema);
