import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';
import {RouteComponentProps} from 'react-router-dom';

const LoginPage = ({history}: RouteComponentProps) => {
  const dispatch = useDispatch<any>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onEmailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };
  const onPasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };
  const onSubmitHandler = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault(); // prevent refresh

    let body = {
      email: email,
      password: password,
    };

    dispatch(loginUser(body)).then((response: any) => {
      console.log('?');
      if (response.payload.loginSuccess) {
        history.push('/');
      } else {
        alert('Error');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <form style={{display: 'flex', flexDirection: 'column'}}>
        <label>Email</label>
        <input type={'email'} value={email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type={'current-password'} value={password} onChange={onPasswordHandler} />
        <br />
        <button type={'submit'} onSubmit={onSubmitHandler}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
