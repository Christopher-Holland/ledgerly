import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  color: {
    type: String,
    default: '#3B82F6',
    match: /^#[0-9A-F]{6}$/i
  },
  icon: {
    type: String,
    default: '💰'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  budget: {
    type: Number,
    min: 0,
    default: 0
  }
}, { timestamps: true });

// Ensure user can't have duplicate category names
categorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
