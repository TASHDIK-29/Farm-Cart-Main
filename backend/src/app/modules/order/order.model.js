import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    consumerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
      }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'], default: 'pending' }, 
  },
  { timestamps: true }
);

export const Order = model('Order', orderSchema);
