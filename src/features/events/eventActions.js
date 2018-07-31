import { toastr } from 'react-redux-toastr';
import { createNewEvent } from '../../app/common/util/helpers';
import moment from 'moment';
import firebase from '../../app/config/firebase';

import { FETCH_EVENTS } from '../../features/events/eventConstants';

import {
	asyncActionStart,
	asyncActionFinish,
	asyncActionError
} from '../async/asyncActions';

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

export const getEventsForDashboard = lastEvent => {
	return async (dispatch, getState) => {
		let today = new Date(Date.now());
		const firestore = firebase.firestore();

		const eventsRef = firestore.collection('events');

		try {
			dispatch(asyncActionStart());

			let startAfter =
				lastEvent &&
				(await firestore
					.collection('events')
					.doc(lastEvent.id)
					.get());

			let query;

			lastEvent
				? (query = eventsRef
						.where('date', '>=', today)
						.orderBy('date')
						.startAfter(startAfter)
						.limit(2))
				: (query = eventsRef
						.where('date', '>=', today)
						.orderBy('date')
						.limit(2));

			let querySnap = await query.get();

			if (querySnap.docs.length === 0) {
				dispatch(asyncActionFinish());
				return querySnap;
			}

			let events = [];

			for (let i = 0; i < querySnap.docs.length; i++) {
				let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
				events.push(evt);
			}

			dispatch({ type: FETCH_EVENTS, payload: { events } });
			dispatch(asyncActionFinish());
			return querySnap;
		} catch (error) {
			console.log(error);
			dispatch(asyncActionError());
		}
	};
};

export const addEventComment = (eventId, values, parentId) => {
	console.log(eventId, values);
	return async (dispatch, getState, { getFirebase }) => {
		const firebase = getFirebase();
		const user = firebase.auth().currentUser;
		let newComment = {
			displayName: user.displayName,
			photoURL: user.photoURL,
			uid: user.uid,
			text: values.comment,
			date: Date.now(),
			parentId: parentId
		};
		try {
			await firebase.push(`event_chat/${eventId}`, newComment);
		} catch (error) {
			console.log(error);
			toastr.error('Oops', 'Problem adding comment');
		}
	};
};
