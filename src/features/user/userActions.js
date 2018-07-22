import moment from 'moment';
import { toastr } from 'react-redux-toastr';

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
			console.log(data);
			await firestore.set(`users/${currentUser.uid}`, { ...data });
			toastr.success('Success', 'Profile updated');
		} catch (error) {
			console.log(error);
		}
	};
};

export const uploadProfileImage = (file, fileName) => {
	return async (dispatch, getState, { getFirebase, getFirestore }) => {
		const firebase = getFirebase();
		const firestore = getFirestore();
		const user = firebase.auth().currentUser;

		const path = `${user.uid}/user_images`;
		const options = {
			name: fileName
		};

		try {
			let uploadedFile = await firebase.uploadFile(path, file, null, options);
			console.log(uploadedFile);
			let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL();
			console.log(downloadURL);
			let userDoc = await firestore.get(`users/${user.uid}`);
			console.log(userDoc.data().photoURL);
			if (!userDoc.data().photoURL) {
				console.log('photo', { label: userDoc.data().photoURL }, 'avatar', {
					label2: userDoc.data().avatarUrl
				});
				await firebase.updateProfile({
					photoURL: downloadURL
				});
				console.log('got now here');
				await user.updateProfile({
					photoURL: downloadURL
				});

				console.log(user.uid, downloadURL);
				await firestore.update(`users/${user.uid}`, { photoURL: downloadURL });
			}
			return await firestore.add(
				{
					collection: 'users',
					doc: user.uid,
					subcollections: [{ collection: 'photos' }]
				},
				{
					name: fileName,
					url: downloadURL
				}
			);
		} catch (error) {
			console.log(error);
			throw new Error('Problem uploading photo');
		}
	};
};
