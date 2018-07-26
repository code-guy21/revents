import firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_KEY,
	authDomain: 'revents-2d8d9.firebaseapp.com',
	databaseURL: 'https://revents-2d8d9.firebaseio.com',
	projectId: 'revents-2d8d9',
	storageBucket: 'revents-2d8d9.appspot.com',
	messagingSenderId: '1027303325634'
};
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {
	timestampsInSnapshots: true
};

firestore.settings(settings);

export default firebase;
