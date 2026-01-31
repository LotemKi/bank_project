import mongoose from 'mongoose';

const transaction = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    fromEmail: { type: String, required: true }, // user.email of sender
    toEmail: { type: String, required: true },   // user.email of recipient
    amount: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'COMPLETED' , required: true },
    description: { type: String }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

export default mongoose.model('Transactions', transaction);
