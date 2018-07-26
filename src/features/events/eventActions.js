import { toastr } from 'react-redux-toastr';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment';

import {
	DELETE_EVENT,
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
	return async (dispatch, getState, { getFirestore, getFirebase }) => {
		const firestore = getFirestore();
		console.log(firestore);
		const user = getState().firebase.profile;
		console.log(user);
		const photoURL = getState().firebase.profile.photoURL;
		console.log(event);
		let newEvent = createNewEvent(user, photoURL, event);
		console.log(newEvent);
		try {
			let createdEvent = await firestore.add(`events`, newEvent);
			await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
				eventId: createdEvent.id,
				userUid: user.uid,
				eventDate: event.date,
				host: true
			});
			toastr.success('Success!', 'Event has been created');
			callback(createdEvent.id);
		} catch (error) {
			toastr.error('Oops', 'Something went wrong');
		}
	};
};

export const updateEvent = event => {
	return async (dispatch, getState, { getFirestore }) => {
		const firestore = getFirestore();
		if (event.date !== getState().firestore.ordered.events[0].date) {
			event.date = moment(event.date).toDate();
		}
		try {
			await firestore.update(`events/${event.id}`, event);
			toastr.success('Success!', 'Event has been updated');
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

export const cancelToggle = (cancelled, eventId) => {
	return async (dispatch, getState, { getFirestore }) => {
		const firestore = getFirestore();
		const message = cancelled
			? 'Are you sure you want to cancel the event?'
			: 'This will reactivate the event - are you sure?';
		try {
			toastr.confirm(message, {
				onOk: () => {
					firestore.update(`events/${eventId}`, {
						cancelled: cancelled
					});
				}
			});
		} catch (error) {
			console.log(error);
		}
	};
};
