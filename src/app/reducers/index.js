import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import { reducer as toastrReducer } from 'react-redux-toastr';
import eventReducer from '../.././features/events/event_reducer';
import modalsReducer from '../../features/modals/modalReducer';
import authReducer from '../../features/auth/authReducer';
import asyncReducer from '../../features/async/asyncReducer';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

const rootReducer = combineReducers({
	form: FormReducer,
	events: eventReducer,
	modals: modalsReducer,
	auth: authReducer,
	async: asyncReducer,
	toastr: toastrReducer,
	firebase: firebaseReducer,
	firestore: firestoreReducer
});

export default rootReducer;
