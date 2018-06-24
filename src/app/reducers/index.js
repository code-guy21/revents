import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import eventReducer from '../.././features/events/event_reducer';

const rootReducer = combineReducers({
	form: FormReducer,
	events: eventReducer
});

export default rootReducer;
