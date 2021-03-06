import express from 'express';
import mongoose from 'mongoose';
import {User} from './models/User';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import {mongoURI} from './config/key';
import {auth} from './middleware/auth';
import IUser from './interfaces/user';
import {userInfo} from 'os';
import {IAuthRequest} from './interfaces/authRequest';

const app = express();
const port = 4000;

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());

// https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
const dbConnection = mongoose.connect(mongoURI);
dbConnection.then(() => console.log('MongoDB Connected...')).catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// CORS ( Cross-Origin-Resource-Sharing ) Test
app.get('/api/hello', (req, res) => {
  res.send('Hello CORS dev');
});

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) {
      return res.json({success: false, err});
    }
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다
  console.log(req);
  /**
   * fixme : email 값은 변수 그대로 할당하면 any 때문에 mongo db 에서 제대로 string 이라고 인식하지 못함
   * req.body.email => any, `${req.body.email}` => string
   * todo : 개선할 것
   */

  User.findOne({email: `${(req.body as IUser).email}`}, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }

    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      // isMatch 가 callback 에 없는걸로 체크
      if (!isMatch) {
        return res.json({loginSuccess: false, message: '비밀번호가 틀렸습니다.'});
      }

      // 비밀번호 맞을시 토큰 생성
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }
        // 토큰을 저장한다. 어디에 ?!  쿠키, 로컬스토리지, 세션 등 각 장단점이 있다.
        // 쿠키, x_auth 라는 이름으로 쿠키에 저장
        res.cookie('x_auth', user.token).status(200).json({loginSuccess: true, userId: user._id});
      });
    });
  });
});

// middleware;
app.get('/api/users/auth', auth, (req: IAuthRequest, res) => {
  // 미들웨어 authentication 이 true
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role !== 0,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req: IAuthRequest, res) => {
  User.findOneAndUpdate({_id: req.user._id}, {token: ''}, {}, (err, user) => {
    if (err) {
      console.log(JSON.stringify(err));
      return res.json({success: false, err});
    }
    return res.status(200).send({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
