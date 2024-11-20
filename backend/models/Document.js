import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    title: {type: String, required: true },
    content: { type: Object, default: {} },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {timestamps: true, versionKey: false }
);

const Document = mongoose.model('Document', DocumentSchema);

export { Document };