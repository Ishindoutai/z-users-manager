const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const app = express();

app.use(cors({ origin: true }));

app.use('/users', require('./src/routes/users'));

exports.api = functions.https.onRequest(app);