// import {Request, Response, NextFunction} from 'express';
// import {User} from '../models/User';
//
// const auth = (req: Request, res: Response, next: NextFunction) => {
//   // 인증처리
//
//   //  클라이언트 쿠키에서 토큰을 가져온다.
//   let token = req.cookies.x_auth;
//
//   // 토큰을 복호화해서 유저를 찾는다
//   User.findByToken(token, (cb) => {});
//
//   User.findByToken(token, (err, user) => {
//     if (err) {
//       throw err;
//     }
//     if (!user) {
//       return res.json({isAuth: false, error: true});
//     }
//
//     // 있으면
//     req.token = token;
//     req.user = user;
//     next(); // 미들웨어 다음으로
//   });
//
//   // 유저 있으면 인증 Okay
//
//   // 유저가 없으면 인증 No!
// };
//
// export {auth};
