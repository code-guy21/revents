import {
	CREATE_EVENT,
	DELETE_EVENT,
	UPDATE_EVENT
} from '../../features/events/eventConstants';

export const deleteEvent = eventId => {
	return {
		type: DELETE_EVENT,
		payload: { eventId }
	};
};

export const createEvent = (event, callback) => {
	callback();
	return {
		type: CREATE_EVENT,
		payload: { event }
	};
};

export const updateEvent = (event, callback) => {
	callback();
	return {
		type: UPDATE_EVENT,
		payload: { event }
	};
};
