import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app, auth, googleProvider;
let firebaseStatus = { ok: false, error: null };

try {
  // Check if API key is obviously missing or just the placeholder
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YourFirebaseApiKeyHere")) {
    throw new Error("auth/invalid-api-key: Please add your real Firebase API Key to the frontend/.env file.");
  }
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  
  console.log("Firebase initialized successfully");
  console.log("Auth loaded successfully");
  firebaseStatus.ok = true;
} catch (error) {
  console.error("Firebase Initialization Error:", error.message);
  firebaseStatus.error = error.message;
}

export const loginWithGoogle = async () => {
  if (!firebaseStatus.ok) throw new Error(firebaseStatus.error);
  
  console.log("Google sign-in started");
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google sign-in success:", result.user.email);
    return result.user;
  } catch (error) {
    console.error("Google sign-in failed:", error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  if (!firebaseStatus.ok) throw new Error(firebaseStatus.error);
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Password Reset Error:", error.message);
    throw error;
  }
};

export { auth, googleProvider, firebaseStatus };
