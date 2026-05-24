// src/config/firebase.js
const admin = require('firebase-admin');

let firebaseApp = null;

const initFirebase = () => {
  if (firebaseApp) return firebaseApp;

  try {
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      console.warn('⚠️  Firebase credentials not set — Google login disabled.');
      return null;
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });

    console.log('✅ Firebase Admin initialized');
    return firebaseApp;
  } catch (err) {
    console.warn('⚠️  Firebase init failed:', err.message);
    return null;
  }
};

const verifyFirebaseToken = async (idToken) => {
  if (!firebaseApp) return null;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    throw new Error('Invalid Firebase token');
  }
};

module.exports = { initFirebase, verifyFirebaseToken };
