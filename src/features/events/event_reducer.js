import {
	CREATE_EVENT,
	DELETE_EVENT,
	UPDATE_EVENT,
	FETCH_EVENTS
} from './eventConstants';
import { createReducer } from '../../app/common/util/reducerUtil';

const initialState = [];

export const deleteEvent = (state, payload) => {
	return state.filter(event => event.id !== payload.eventId);
};

export const createEvent = (state, payload) => {
	return [...state, Object.assign({}, payload.event)];
};

export const updateEvent = (state, payload) => {
	return [
		...state.filter(event => event.id !== payload.event.id),
		Object.assign({}, payload.event)
	];
};

export const fetchEvents = (state, payload) => {
	return payload.events;
};

export default createReducer(initialState, {
	[UPDATE_EVENT]: updateEvent,
	[DELETE_EVENT]: deleteEvent,
	[CREATE_EVENT]: createEvent,
	[FETCH_EVENTS]: fetchEvents
});
