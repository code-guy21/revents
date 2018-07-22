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
				displayName: user.displayName
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
			let user = await firebase.login({
				provider: selectedProvider,
				type: 'popup'
			});
			console.log(user);
			if (user.additionalUserInfo.isNewUser) {
				await firestore.set(`users/${user.user.uid}`, {
					displayName: user.profile.displayName,
					createdAt: firestore.FieldValue.serverTimestamp()
				});

				switch (user.additionalUserInfo.providerId) {
					case 'google.com':
						const googleresp = await fetch(
							user.additionalUserInfo.profile.picture
						);
						const googleimage = await googleresp.blob();
						console.log(googleimage);
						dispatch(uploadProfileImage(googleimage, 'profilePicture'));
						break;
					case 'facebook.com':
						const facebookresp = await fetch(
							user.additionalUserInfo.profile.picture.data.url
						);
						const facebookimage = await facebookresp.blob();
						console.log(facebookimage);
						dispatch(uploadProfileImage(facebookimage, 'profilePicture'));
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
