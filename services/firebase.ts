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
let app;
let auth;
let db;

try {
  // Check if config is dummy/placeholder
  // We check if the apiKey is the specific placeholder or empty. 
  // You can remove this specific check if you have pasted your real keys.
  const isPlaceholder = firebaseConfig.apiKey === "AIzaSyCwjW2EKhIL2UtT9auKiEsoZGjm2TBC-Mw";

  if (!isPlaceholder && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase config appears to be missing or using placeholder values.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, db };

export const isFirebaseConfigured = () => {
  // Returns true only if app and auth were successfully initialized
  return !!app && !!auth;
};
