const express = require('express');
const app = express();
const port = 3000;

const randomWords = require('random-words');
const request = require('request');

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
app.post('/posts', async (req, res) => {
  const {usuario, descripcion} = req.body;
  const post = {usuario, descripcion, time: new Intl.DateTimeFormat(['ban', 'id']).format(new Date())};
  await collection.doc().set(post)
  .then(respuesta => res.status(201).send(respuesta))
  .catch(err => console.log(err))
})

/* get */
app.get('/posts', async (req, res) => {
  const posts = [];
  try{
    const snapshot = await collection.get();
    snapshot.forEach(doc => posts.push({id: doc.id, data: doc.data()}));
    res.status(200).send(posts);
  }
  catch(error){
    console.log(error);
  }
})

/* delete */
app.delete('/posts/:id', async (req, res) => {
    await collection.doc(req.params.id).delete()
    .then(respuesta => res.status(204).send(respuesta))
    .catch(err => console.log(err))
});

/* apis */

/* get cover */

const getISBN = (titulo) => {
  const URL_OPENLIBRARY = 'http://openlibrary.org/search.json?q=' + titulo;
  return new Promise((resolve, reject) => {
    request.get(URL_OPENLIBRARY, (err, res, body) => {
      console.log('Buscando ISBN...');
      res.statusCode === 200
      ? resolve(JSON.parse(body).docs[0].isbn[1])
      : eject({mensaje: 'Error buscando ISBN', body});
    });
  });
}

const getImage = (isbn) => {
  const URL_GOOGLEBOOK = 'https://www.googleapis.com/books/v1/volumes?q=' + isbn;
  return new Promise((resolve, reject) => {
    request.get(URL_GOOGLEBOOK, (err, res, body) => {
      console.log('Buscando cover...');
      res.statusCode === 200 && JSON.parse(body).items[0].volumeInfo.imageLinks.thumbnail
      ? resolve(JSON.parse(body).items[0].volumeInfo.imageLinks.thumbnail)
      : eject({mensaje: 'Error buscando cover', body});
    });
  });
}



const getCover = async () => {
  let palabra = randomWords();
  let isbn = await getISBN(palabra);
  console.log(isbn);
  let link = await getImage(isbn);
  console.log(link);
};
const getCoverAlbum = (palabra) =>{
  URL_LASTFM = `http://ws.audioscrobbler.com/2.0/?method=album.search&album=${palabra}&api_key=3ea9433a1af63611e25be95769a30969&format=json`;
  return new Promise((resolve, reject) => {
    request.get(URL_LASTFM, (err, res, body) => {
      console.log('Buscando album...');
      res.statusCode === 200
      ? resolve(JSON.parse(body).results.albummatches.album[0].image[2]['#text'])
      : eject({mensaje: 'Error buscando cover', body});
    });
  });
}

const getAlbum = async () => {
  let palabra = randomWords();
  console.log(palabra);
  let link = await getCoverAlbum(palabra);
  console.log(link);
};


/* listener */
app.listen(port, () => {
  console.log('starting server...')
  getAlbum();
})
