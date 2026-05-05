import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // apiKey: 'SUA_API_KEY', 
  // authDomain: 'SEU_AUTH_DOMAIN', 
  // projectId: 'SEU_PROJECT_ID', 
  // storageBucket: 'SEU_STORAGE_BUCKET', 
  // messagingSenderId: 'SEU_MESSAGING_SENDER_ID', 
  // appId: 'SEU_APP_ID', 
  // databaseURL: 'SUA_DATABASE_URL', 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
export { auth, db };
