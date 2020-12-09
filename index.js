const express = require('express');
const app = express();
const port = 3000;

/* config firebase db */
var admin = require("firebase-admin");
var serviceAccount = require("./proyecto-final-5597c-firebase-adminsdk-6isyj-202cb58a3b.json");

/* credenciales */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/* middlewares */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/* objeto db */
const db = admin.firestore();
let collection = db.collection('posts')

/* endpoint de post*/

/* post */
app.post('/post', async (req, res) => {
  const {usuario, descripcion} = req.body;
  const post = {usuario, descripcion};
  await collection.doc().set(post)
  .then(respuesta => res.status(201).send(respuesta))
  .catch(err => console.log(err))
})

/* get */
app.get('/users', async (req, res) => {
  const posts = [];
  try{
    const snapshot = await collection.get();
    snapshot.forEach(doc => users.push({id: doc.id, data: doc.data()}));
    res.status(200).send(users);
  }
  catch(error){
    console.log(error);
  }
})

/* delete */

/* listener */
app.listen(port, () => {
  console.log('example running...')
})
