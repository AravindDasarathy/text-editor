import mongoose from 'mongoose';

const verificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  });

const VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema)

export { VerificationToken };
