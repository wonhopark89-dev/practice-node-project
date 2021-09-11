import mongoose, {Schema} from 'mongoose';

// https://mongoosejs.com/docs/guide.html#definition
const userSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 6,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// https://mongoosejs.com/docs/guide.html#models
const User = mongoose.model('User', userSchema);

export {User};
