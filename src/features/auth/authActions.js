import { closeModal } from '../modals/modalActions';
import { SubmissionError, reset } from 'redux-form';
import { toastr } from 'react-redux-toastr';
import { uploadProfileImage } from '../user/userActions';

export const login = creds => {
	return async (dispatch, getState, { getFirebase }) => {
		const firebase = getFirebase();
		try {
			await firebase
				.auth()
				.signInWithEmailAndPassword(creds.email, creds.password);
			dispatch(closeModal());
		} catch (error) {
			console.log(error);
			throw new SubmissionError({
				_error: 'Login failed'
			});
		}
	};
};

export const registerUser = user => {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		const firebase = getFirebase();
		const firestore = getFirestore();

		try {
			let createdUser = await firebase
				.auth()
				.createUserWithEmailAndPassword(user.email, user.password);

			await firebase.updateProfile({
				displayName: user.displayName,
				uid: createdUser.user.uid,
				createdAt: firebase.database.ServerValue.TIMESTAMP
			});
			let newUser = {
				displayName: user.displayName,
				createdAt: firestore.FieldValue.serverTimestamp()
			};
			await firestore.set(`users/${createdUser.user.uid}`, { ...newUser });
			dispatch(closeModal());
		} catch (error) {
			console.log(error);
			throw new SubmissionError({
				_error: error.message
			});
		}
	};
};

export const socialLogin = selectedProvider => {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		const firebase = getFirebase();
		const firestore = getFirestore();
		try {
			dispatch(closeModal());
			let user;
			switch (selectedProvider) {
				case 'google':
					let googleprovider = new firebase.auth.GoogleAuthProvider();
					googleprovider.setCustomParameters({
						prompt: 'select_account'
					});
					user = await firebase.auth().signInWithPopup(googleprovider);
					break;
				case 'facebook':
					let facebookprovider = new firebase.auth.FacebookAuthProvider();
					facebookprovider.setCustomParameters({
						auth_type: 'reauthenticate'
					});
					user = await firebase.auth().signInWithPopup(facebookprovider);
					break;
				default:
					return;
			}

			if (user.additionalUserInfo.isNewUser) {
				await firebase.updateProfile({
					displayName: user.user.displayName,
					createdAt: firebase.database.ServerValue.TIMESTAMP,
					uid: user.user.uid
				});

				await firestore.set(`users/${user.user.uid}`, {
					displayName: user.user.displayName,
					createdAt: firestore.FieldValue.serverTimestamp()
				});

				switch (user.additionalUserInfo.providerId) {
					case 'google.com':
						const googleresp = await fetch(
							user.additionalUserInfo.profile.picture
						);
						const googleimage = await googleresp.blob();
						dispatch(uploadProfileImage(googleimage));
						break;
					case 'facebook.com':
						const facebookresp = await fetch(
							user.additionalUserInfo.profile.picture.data.url
						);
						const facebookimage = await facebookresp.blob();

						dispatch(uploadProfileImage(facebookimage));
						break;
					default:
						return;
				}
			}
		} catch (error) {
			console.log(error);
		}
	};
};

export const updatePassword = creds => {
	return async (dispatch, getState, { getFirebase }) => {
		const firebase = await getFirebase();
		const user = firebase.auth().currentUser;
		try {
			await user.updatePassword(creds.newPassword1);
			await dispatch(reset('account'));
			toastr.success('Success', 'Your password has been updated');
		} catch (error) {
			throw new SubmissionError({
				_error: error.message
			});
		}
	};
};
