const mongoose = require('mongoose');
import { Types } from 'mongoose';

const STATUS_CODES = [0, 1, 2, 3, 4];

const orderSchema = mongoose.Schema(
  {
    client: {
      type: Types.ObjectId,
      ref: 'user',
      required: true,
      immutable: true,
    },
    seller: {
      type: Types.ObjectId,
      ref: 'user',
      required: true,
      immutable: true,
    },
    product: {
      type: Types.ObjectId,
      ref: 'product',
      required: true,
      inmmutable: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
      enum: STATUS_CODES,
    },
    total: {
      type: Number,
      required: true,
    },
    comments: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('order', orderSchema);
