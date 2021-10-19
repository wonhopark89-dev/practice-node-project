import axios from 'axios';
import {LOGIN_USER, REGISTER_USER} from './types';

export function loginUser(dataToSubmit: any) {
  console.log('hello');
  console.log(dataToSubmit);
  const request = axios.post('/api/users/login', dataToSubmit).then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit: any) {
  const request = axios.post('/api/users/register', dataToSubmit).then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}
