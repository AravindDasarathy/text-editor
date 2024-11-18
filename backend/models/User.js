import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      }
    },
    versionKey: false,
    timestamps: true
  });

const User = mongoose.model('User', userSchema)

export { User };
