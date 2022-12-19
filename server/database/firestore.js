const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const config = require('../config');

const firebaseApp = initializeApp(config.firebaseConfig);
const fireStore = getFirestore(firebaseApp);

module.exports = fireStore;