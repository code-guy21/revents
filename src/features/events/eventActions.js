import { toastr } from 'react-redux-toastr';

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
	return async dispatch => {
		try {
			dispatch({
				type: CREATE_EVENT,
				payload: { event }
			});
			toastr.success('Success!', 'Event has been created');
			callback();
		} catch (error) {
			toastr.error('Oops', 'Something went wrong');
		}
	};
};

export const updateEvent = (event, callback) => {
	return async dispatch => {
		try {
			dispatch({
				type: UPDATE_EVENT,
				payload: { event }
			});
			toastr.success('Success!', 'Event has been updated');
			callback();
		} catch (error) {
			toastr.error('Oops', 'Something went wrong');
		}
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
