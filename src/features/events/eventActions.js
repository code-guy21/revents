import {
	CREATE_EVENT,
	DELETE_EVENT,
	UPDATE_EVENT,
	FETCH_EVENTS
} from '../../features/events/eventConstants';

import {
	asyncActionStart,
	asyncActionFinish,
	asyncActionError
} from '../async/asyncActions';

import { fetchSampleData } from '../../app/data/mockApi';

export const fetchEvents = events => {
	return {
		type: FETCH_EVENTS,
		payload: events
	};
};

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

export const loadEvents = () => {
	return async dispatch => {
		try {
			dispatch(asyncActionStart());
			let events = await fetchSampleData();
			dispatch(fetchEvents(events));
			dispatch(asyncActionFinish());
		} catch (error) {
			console.log(error);
			dispatch(asyncActionError());
		}
	};
};
