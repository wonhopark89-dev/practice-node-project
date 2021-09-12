import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10; // 10자리 salt

// todo : Improve
// interface UserProps {
//   name: string;
//   email: string;
//   password: string;
//   role: number;
//   image: string;
//   token: string;
//   tokenExp: number;
// }
//
// export interface UserModelProps extends UserProps, Document {}

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
  } else {
    next();
  }
});

// 패스워드 비교하는 함수 추가
userSchema.methods.comparePassword = function (plainPassword, cb) {
  // cb = callback
  // plainPassword 123456, 암호화된 비밀번호 !Q@W#E~~
  // let user = this;
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

// todo : 패스워드 비교하는 함수 수정
// userSchema.methods.comparePassword = async function (plainPassword: string) {
//   const result = await bcrypt.compare(plainPassword, this.password);
//   return result;
// };

userSchema.methods.generateToken = function (cb) {
  let user = this;
  // jsonwebtoken 이용해서 token 생성
  // 'tomato' 자리에 들어가는 값을 알아야 사용자 식별이 가능하다.
  const token = jwt.sign(user._id.toHexString(), 'tomoto');
  // user._id + 'tomato' = token
  user.token = token;
  user.save((err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  // 토큰을 decode
  jwt.verify(token, 'tomato', function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token 과 db 에 보관된 토큰이 일치하는지 확인
    user.findOne({_id: decoded, token: token}, function (err, user) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};

// https://mongoosejs.com/docs/guide.html#models
const User = mongoose.model('User', userSchema);

export {User};
