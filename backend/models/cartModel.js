import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      size: { type: String, required: true },
      color: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

export default mongoose.model('Cart', cartSchema);