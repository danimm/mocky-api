export default {
    apiKey: process.env.NITRO_FIREBASE_API_KEY,
    authDomain: process.env.NITRO_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NITRO_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NITRO_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NITRO_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NITRO_FIREBASE_APP_ID,
    measurementId: process.env.NITRO_FIREBASE_MEASUREMENT_ID,
} as const;
