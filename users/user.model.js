const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: [
      {
        type: mongoose.Types.ObjectId,
        default: null,
      },
    ],
    // campos
    name: { type: String, required: [true, 'Nombra tu user'] },
    enable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('user', userSchema);
