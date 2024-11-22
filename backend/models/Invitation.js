import mongoose from 'mongoose';
import validator from 'validator';
import { invitationConfigs } from '../configs/app.js';

const invitationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Invitee email is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address',
      },
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: [true, 'Associated document ID is required'],
    },
    token: {
      type: String,
      required: [true, 'Invitation token is required'],
      unique: true,
    },
    status: {
      type: String,
      enum: invitationConfigs.states,
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + invitationConfigs.expiry,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically delete expired invitations
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invitation = mongoose.model('Invitation', invitationSchema);

export { Invitation };
