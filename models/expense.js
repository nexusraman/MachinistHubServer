import mongoose from 'mongoose';

const expenseSchema = mongoose.Schema({
  payee: String,
  reason: String,
  amount: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  medium: {
    type: String,
    enum: ['Cash', 'Transfer'], // Add medium type validation
  },
  transferMethod: {
    type: String,
    enum: ['UPI', 'Bank Transfer'],
  },
  comment: {
    type: String,
    default: '',
  },
})

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
