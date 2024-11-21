import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      minlength: 3,
      maxlength: 30,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: props => `${props.value} is not a valid email`
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: {
      type: String,
      unique: true,
    },
    verificationTokenExpiresAt: {
      type: Date
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      }
    },
    versionKey: false,
    timestamps: true,
    strict: true
  });

const User = mongoose.model('User', userSchema)

export { User };
