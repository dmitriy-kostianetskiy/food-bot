import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const app = firebase.initializeApp({
  apiKey: 'AIzaSyDv55zJ3FwnxQ3gQD9xDPKZyNSoK-PJ82I',
  authDomain: 'generate-menu.firebaseapp.com',
  databaseURL: 'https://generate-menu.firebaseio.com',
  projectId: 'generate-menu',
  storageBucket: 'generate-menu.appspot.com',
  messagingSenderId: '810760063997',
  appId: '1:810760063997:web:382b3714256a0a4b66e794',
  measurementId: 'G-JZPJP21GS3'
})

export const firestore = app.firestore()
export const auth = app.auth()
