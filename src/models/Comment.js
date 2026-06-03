import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  commentId: {
    type: String,
    unique: true,
    required: true
  },
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
