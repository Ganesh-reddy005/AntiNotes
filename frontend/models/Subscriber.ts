import { Schema, model, models } from 'mongoose';

const SubscriberSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Prevents duplicate emails
    trim: true,
    lowercase: true,
  },
  source: {
    type: String,
    default: 'hero', // Good for tracking if you add other forms later
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscriber = models.Subscriber || model('Subscriber', SubscriberSchema);

export default Subscriber;