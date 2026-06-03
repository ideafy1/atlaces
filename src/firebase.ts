import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAD7XnA-ooSfl88zlfZKIUtu7IEK54QO1M",
  authDomain: "brainheal-india.firebaseapp.com",
  projectId: "brainheal-india",
  storageBucket: "brainheal-india.firebasestorage.app",
  messagingSenderId: "896565229301",
  appId: "1:896565229301:web:eb32f38fe7c90ae93d77bc",
  measurementId: "G-2YVY612H6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
