import express from 'express';
import mongoose from 'mongoose';

// const express = require('express');
const app = express();
const port = 4000;

const MONGODB_USER_URL =
  'mongodb+srv://wonhopark:dnjsghxptmxm1!@practice-node.b3nrq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options
const dbConnection = mongoose.connect(MONGODB_USER_URL);
dbConnection.then(() => console.log('MongoDB Connected...')).catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
