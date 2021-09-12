import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10; // 10자리 salt

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

// save 를 수행전
userSchema.pre('save', function (next) {
  // userSchema
  let user = this;

  // password 를 수정할때만 작동되도록 설정
  // name, email 수정할때 hash 동작하지 않도록
  if (user.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, (err, hash) => {
        // Store hash in your password DB.
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  }
});

// https://mongoosejs.com/docs/guide.html#models
const User = mongoose.model('User', userSchema);

export {User};
