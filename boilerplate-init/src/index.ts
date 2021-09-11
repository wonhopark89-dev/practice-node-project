import express from 'express';
import mongoose from 'mongoose';
import {User} from './models/User';
import bodyParser from 'body-parser';
// const express = require('express');
const app = express();
const port = 4000;

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());

const MONGODB_USER_URL =
  'mongodb+srv://wonhopark:dnjsghxptmxm1!@practice-node.b3nrq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
const dbConnection = mongoose.connect(MONGODB_USER_URL);
dbConnection.then(() => console.log('MongoDB Connected...')).catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({success: false, err});
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
