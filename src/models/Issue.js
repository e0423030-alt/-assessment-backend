import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  issueId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  severity: {
    type: String,
    enum: ['minor', 'major', 'critical'],
    default: 'major'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'testing', 'resolved', 'closed'],
    default: 'open'
  }
}, { timestamps: true });

export default mongoose.model('Issue', issueSchema);
