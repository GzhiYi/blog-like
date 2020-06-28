const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

let db = admin.firestore();

const writeLike = (params) => {
  let docRef = db.collection('like').doc(params.id);

  docRef.set({
    postTitle: params.title,
    likeTime: new Date().toLocaleString()
  });
}
exports.newLike = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    try {
      // eslint-disable-next-line promise/catch-or-return
      db.collection('like')
        .where("postTitle", "==", request.body.title)
        .get()
        // eslint-disable-next-line promise/always-return
        .then(res => {
          let isLike = false
          // eslint-disable-next-line promise/always-return
          try {
            res.forEach(doc => {
              if (doc.id === request.body.id && !isLike) {
                isLike = true
              }
            })
            if (!isLike) {
              writeLike(request.body)
              response.send({
                data: 'like success!',
                code: 0
              })
            } else {
              response.send({
                data: '',
                message: 'like 过啦',
                code: 1
              })
            }
          } catch (error) {
            console.log('error', error)
          }
        })
      
    } catch (error) {
      console.log('error info', error)
      response.send({
        data: error,
        message: request.body,
        code: 1
      })
    }
  })
})

exports.getLikes = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const { title, id } = request.body
    db.collection('like')
      .where("postTitle", "==", title)
      .get()
      // eslint-disable-next-line promise/always-return
      .then(res => {
        let isLike = false
        // eslint-disable-next-line promise/always-return
        try {
          res.forEach(doc => {
            if (doc.id === id && !isLike) {
              isLike = true
            }
          })
        } catch (error) {
          console.log('error', error)
        }
        response.send({
          data: res.size,
          isLike,
          message: 'oooooooook',
          code: 0
        })
      })
      .catch(error => {
        response.send({
          data: error,
          message: request.body,
          code: 1
        })
      })
  })
})