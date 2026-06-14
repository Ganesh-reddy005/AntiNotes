import { Schema, model, models } from 'mongoose';

const PulseVoteSchema = new Schema({
  category: {
    type: String,
    enum: ['logic', 'syntax'], // Strict typing: only these two allowed
    required: true,
  },
  ipHash: {
    type: String, // Basic protection to prevent spam spamming (optional for now)
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// "models.PulseVote || model..." checks if it already exists to prevent recompilation errors
const PulseVote = models.PulseVote || model('PulseVote', PulseVoteSchema);

export default PulseVote;