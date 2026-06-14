import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { GROCERY_DATA } from './src/data/mockProducts.js';

const firebaseConfig = {
  apiKey: "AIzaSyDZKAnvaRHwAP1G4sm0AgAjPm2wrgdCnMc",
  authDomain: "rohit-mart-99a4f.firebaseapp.com",
  projectId: "rohit-mart-99a4f",
  storageBucket: "rohit-mart-99a4f.firebasestorage.app",
  messagingSenderId: "1014681199826",
  appId: "1:1014681199826:web:66d11ce4e112305d9cf90b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    console.log("Connecting to Firestore...");
    const colRef = collection(db, "products");
    
    console.log("Fetching existing products...");
    const snap = await getDocs(colRef);
    console.log(`Found ${snap.docs.length} old products. Deleting...`);
    
    for (const d of snap.docs) {
      await deleteDoc(doc(db, "products", d.id));
    }
    
    console.log(`Adding ${GROCERY_DATA.length} new products...`);
    for (const item of GROCERY_DATA) {
      await addDoc(colRef, item);
    }
    
    console.log(`✅ SUCCESS! All ${GROCERY_DATA.length} products uploaded securely via Node script.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration Error:", err);
    process.exit(1);
  }
}

run();
