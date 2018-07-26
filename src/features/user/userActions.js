import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import cuid from 'cuid';
import {
	asyncActionStart,
	asyncActionFinish,
	asyncActionError
} from '../async/asyncActions';

export const updateProfile = user => {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		const firebase = getFirebase();
		const firestore = getFirestore();

		const { isLoaded, isEmpty, ...updatedUser } = user;
		if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
			updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
		}

		try {
			const currentUser = await firebase.auth().currentUser;

			await firebase.updateProfile(updatedUser);
			const { providerData, avatarUrl, ...data } = updatedUser;

			await firestore.set(`users/${currentUser.uid}`, { ...data });
			toastr.success('Success', 'Profile updated');
		} catch (error) {
			console.log(error);
		}
	};
};

export const uploadProfileImage = (file, fileName) => {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		const imageName = cuid();
		const firebase = getFirebase();
		const firestore = getFirestore();
		const user = firebase.auth().currentUser;

		const path = `${user.uid}/user_images`;
		const options = {
			name: imageName
		};

		try {
			dispatch(asyncActionStart());
			let uploadedFile = await firebase.uploadFile(path, file, null, options);

			let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();

			let userDoc = await firestore.get(`users/${user.uid}`);

			if (!userDoc.data().photoURL) {
				await firebase.updateProfile({
					photoURL: downloadURL
				});

				await user.updateProfile({
					photoURL: downloadURL
				});

				await firestore.update(`users/${user.uid}`, { photoURL: downloadURL });
			}
			await firestore.add(
				{
					collection: 'users',
					doc: user.uid,
					subcollections: [{ collection: 'photos' }]
				},
				{
					name: imageName,
					url: downloadURL
				}
			);
			dispatch(asyncActionFinish());
		} catch (error) {
			console.log(error);
			dispatch(asyncActionError());
			throw new Error('Problem uploading photo');
		}
	};
};

export const deletePhoto = photo => {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		const firebase = getFirebase();
		const firestore = getFirestore();
		const user = firebase.auth().currentUser;

		try {
			await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
			await firestore.delete({
				collection: 'users',
				doc: user.uid,
				subcollections: [{ collection: 'photos', doc: photo.id }]
			});
		} catch (error) {
			console.log(error);
			throw new Error('Problem deleting the photo');
		}
	};
};

export const setMainPhoto = photo => {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		const firebase = getFirebase();
		const firestore = getFirestore();
		const user = firebase.auth().currentUser;
		try {
			await firestore.update(`users/${user.uid}`, { photoURL: photo.url });
			await firebase.updateProfile({
				photoURL: photo.url
			});
		} catch (error) {
			console.log(error);
			throw new Error('Problem settings main photo');
		}
	};
};

export const joinEvent = event => {
	return async (dispatch, getState, { getFirestore, getFirebase }) => {
		const firestore = getFirestore();
		const firebase = getFirebase();
		const currentUser = firebase.auth().currentUser;
		try {
			console.log(currentUser);
			console.log(event);
			await firestore.update(`events/${event.id}`, {
				[`attendees.${currentUser.uid}`]: {
					displayName: currentUser.displayName,
					going: true,
					host: false,
					id: currentUser.uid,
					joinDate: Date.now(),
					photoURL: currentUser.photoURL
				}
			});

			await firestore.set(`event_attendee/${event.id}_${currentUser.uid}`, {
				eventId: event.id,
				userUid: currentUser.uid,
				eventDate: event.date,
				host: false
			});
			toastr.success('Success', 'You have signed up to the event');
		} catch (error) {
			console.log(error);
			toastr.error('Oops', 'Problem signing up to event');
		}
	};
};

export const cancelJoin = event => {
	return async (dispatch, getState, { getFirestore, getFirebase }) => {
		const firestore = getFirestore();
		const firebase = getFirebase();
		const user = firebase.auth().currentUser;
		try {
			await firestore.update(`events/${event.id}`, {
				[`attendees.${user.uid}`]: firestore.FieldValue.delete()
			});
			await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
			toastr.success('Success', 'You have removed yourself from the event');
		} catch (error) {
			console.log(error);
			toastr.error('Oops', 'Something went wrong');
		}
	};
};
