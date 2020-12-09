const express = require('express');
const app = express();
const port = 3000;

/* config firebase db */
var admin = require("firebase-admin");
var serviceAccount = require("./proyecto-final-5597c-firebase-adminsdk-6isyj-202cb58a3b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


/* listenes */
app.listen(port, () => {
  console.log('example running...')
})
