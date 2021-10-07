import mongoose, {Model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import IUser from '../interfaces/user';

// interface IUserModel extends Model<IUser> {
//   // mongoose statics
//   findByToken: (token: string) => IUser;
// }

const saltRounds = 10; // 10자리 salt
// https://mongoosejs.com/docs/guide.html#definition
const userSchema: Schema<IUser> = new Schema(
  {
    name: {type: String, maxlength: 50},
    email: {type: String, trim: true, unique: 1},
    password: {type: String, minlength: 6},
    role: {type: Number, default: 0},
    image: {type: String},
    token: {type: String},
    tokenExp: {type: Number},
  },
  {timestamps: true},
);

// origin
// save 를 수행전
userSchema.pre<IUser>('save', function (next) {
  // userSchema
  // let user = this;
  // password 를 수정할때만 작동되도록 설정
  // name, email 등 수정할때 hash 동작하지 않도록
  if (this.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return next(err);
      }
      // 해쉬
      bcrypt.hash(this.password, salt, (err, hash) => {
        // Store hash in your password DB.
        if (err) {
          return next(err);
        }
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (
  plainPassword: string,
  callback: (error: Error | null, match: boolean) => void,
) {
  // cb = callback
  // plainPassword 123456, 암호화된 비밀번호 !Q@W#E~~
  let user = this;
  bcrypt.compare(plainPassword, user.password, (err, isMatch) => {
    if (err) {
      return callback(err, false);
    }
    callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function (callback: (error: Error | null, token: IUser) => void) {
  let user = this;
  // jsonwebtoken 이용해서 token 생성
  // 'tomato' 자리에 들어가는 값을 알아야 사용자 식별이 가능하다.
  // user._id + 'tomato' = token
  user.token = jwt.sign(user._id.toHexString(), 'tomoto');
  user.save((err, user) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, user);
  });
};

// userSchema.statics.findByToken = function (token, cb) {
//   let user = this;
//   // 토큰을 decode
//   jwt.verify(token, 'tomato', function (err, decoded) {
//     // 유저 아이디를 이용해서 유저를 찾은 다음에
//     // 클라이언트에서 가져온 token 과 db 에 보관된 토큰이 일치하는지 확인
//     user.findOne({_id: decoded, token: token}, function (err, user) {
//       if (err) {
//         return cb(err);
//       }
//       cb(null, user);
//     });
//   });
// };

// userSchema.statics.findByToken = function (token: string, cb: (error: Error, user: IUserDocument) => void) {
//   let user = this;
//   return jwt.verify(token, 'tomato', (err, decoded) => {
//     return user.findOne({_id: decoded, token: token}, (_error, _user) => cb(_error, _user));
//   });
// };

// https://mongoosejs.com/docs/guide.html#models
const User = mongoose.model<IUser>('User', userSchema);

export {User};
