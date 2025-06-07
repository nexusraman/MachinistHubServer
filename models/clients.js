import mongoose from 'mongoose';

const clientSchema = mongoose.Schema({
  name: String,
  phone: String,
  balance: Number,
  calculatedBalance: Number,
  category: String,
  entries: [
    {
      subId: { type: String, required: true }, // existing field
      date: Date,
      size: String,
      quantity: String
    }
  ],
payments: [
  {
    date: Date,
    amount: Number,
    paymentId: { type: String, required: true },
    medium: {
      type: String,
      enum: ['Cash', 'Transfer', 'Online'], // add Online if relevant
      default: 'Cash',
    },
 transferMethod: {
  type: String,
  enum: ['UPI', 'Bank Transfer', null], // explicitly allow null
  default: null,
},
    comment: {
      type: String,
      default: '',
    },
  }
]

});

const Clients = mongoose.model('Clients', clientSchema);

export default Clients;
