import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import eventReducer from '../.././features/events/event_reducer';
import modalsReducer from '../../features/modals/modalReducer';
import authReducer from '../../features/auth/authReducer';
import asyncReducer from '../../features/async/asyncReducer';

const rootReducer = combineReducers({
	form: FormReducer,
	events: eventReducer,
	modals: modalsReducer,
	auth: authReducer,
	async: asyncReducer
});

export default rootReducer;
