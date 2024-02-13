import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCJti05FOIFqZqvRSIiHt3NxfO7-AiTvmY',
  authDomain: 'snapchatter-ef514.firebaseapp.com',
  projectId: 'snapchatter-ef514',
  storageBucket: 'snapchatter-ef514.appspot.com',
  messagingSenderId: '763523330818',
  appId: '1:763523330818:web:05ddc6010b6c905c60c81b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
