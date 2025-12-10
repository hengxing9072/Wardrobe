import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ------------------------------------------------------------------
// ⚠️ ACTION REQUIRED: REPLACE THIS CONFIG WITH YOUR FIREBASE CONFIG
// ------------------------------------------------------------------
// 1. Go to console.firebase.google.com
// 2. Create a new project
// 3. Add a Web App (</> icon)
// 4. Copy the config object below
// ------------------------------------------------------------------

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwjW2EKhIL2UtT9auKiEsoZGjm2TBC-Mw",
  authDomain: "my-wardrobe-6f6da.firebaseapp.com",
  projectId: "my-wardrobe-6f6da",
  storageBucket: "my-wardrobe-6f6da.firebasestorage.app",
  messagingSenderId: "694992438364",
  appId: "1:694992438364:web:a3baf6d6eb63045808d299",
  measurementId: "G-278YW59VQX"
};

// Initialize Firebase
// We wrap this in a try-catch to prevent the app from crashing entirely if config is missing,
// allowing the UI to show a helpful message instead.
let app;
let auth;
let db;

try {
  // Use namespace import to access initializeApp
  app = firebaseApp.initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization failed. Did you add your config in services/firebase.ts?", error);
}

export { auth, db };
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
};
