import React, {useState} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../../_actions/user_action';

const RegisterPage = ({history}: RouteComponentProps) => {
  const dispatch = useDispatch<any>();
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const onEmailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent refresh

    if (password !== confirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.');
    }

    let body = {
      email: email,
      name: name,
      password: password,
    };

    dispatch(registerUser(body)).then((response: any) => {
      if (response.payload.success) {
        history.push('/login');
      } else {
        alert('Failed to sign up');
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
      <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type={'email'} value={email} onChange={onEmailHandler} />

        <label>Name</label>
        <input type={'text'} value={name} onChange={onNameHandler} />

        <label>Password</label>
        <input type={'password'} value={password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input type={'password'} value={confirmPassword} onChange={onConfirmPasswordHandler} />

        <br />
        <button type={'submit'}>회원가입</button>
      </form>
    </div>
  );
};
export default RegisterPage;
