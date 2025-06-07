import mongoose from 'mongoose';

const incomeSchema = mongoose.Schema({
  paymentId: { type: String, required: true, unique: true }, // ← NEW FIELD
  client: String,
  reason: String,
  amount: Number,
  medium: {
    type: String,
    enum: ['Cash', 'Transfer'],
  },
  transferMethod: {
    type: String,
    enum: ['UPI', 'Bank Transfer'],
  },
  comment: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Income = mongoose.model('Income', incomeSchema);

export default Income;
