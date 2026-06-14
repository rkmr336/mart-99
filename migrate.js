import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { GROCERY_DATA } from './src/data/mockProducts.js';

// Parse .env
const envStr = fs.readFileSync('.env', 'utf-8');
const env = {};
envStr.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  console.log(`Starting migration of ${GROCERY_DATA.length} products...`);
  
  let success = 0;
  for (const product of GROCERY_DATA) {
    try {
      const docRef = doc(db, 'products', product.id);
      await setDoc(docRef, product);
      success++;
      if (success % 10 === 0) console.log(`Uploaded ${success}/${GROCERY_DATA.length}...`);
    } catch (error) {
      console.error(`Failed to upload ${product.id}:`, error.message);
    }
  }
  
  console.log(`Migration complete! Successfully uploaded ${success} products.`);
  process.exit(0);
}

migrate();
