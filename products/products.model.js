import mongoose from 'mongoose';
import { Types } from 'mongoose';

const productSchema = mongoose.Schema(
  {
    // campos
    name: { type: String, required: [true, 'Nombra tu product'] },
    comments: {
      type: String,
    },
    category: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('product', productSchema);
