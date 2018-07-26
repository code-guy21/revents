import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Grid } from 'semantic-ui-react';
import UserHeader from './UserHeader';
import UserInfo from './UserInfo';
import UserPhotos from './UserPhotos';
import UserEvents from './UserEvents';
import UserSidebar from './UserSidebar';

const query = ({ match }) => {
	return [
		{
			collection: 'users',
			doc: match.params.id,
			subcollections: [{ collection: 'photos' }],
			storeAs: 'photos'
		},
		{
			collection: 'users',
			doc: match.params.id,
			storeAs: 'profile'
		}
	];
};

const mapState = state => {
	let user = {};

	if (state.firestore.ordered.profile) {
		user = state.firestore.ordered.profile[0];
	}

	return {
		auth: state.firebase.auth,
		profile: user,
		photos: state.firestore.ordered.photos
	};
};

class UserDetailedPage extends Component {
	render() {
		const { profile, photos, auth } = this.props;
		const isCurrentUser = profile.id === auth.uid;
		return (
			<Grid>
				<UserHeader user={profile} />
				<UserInfo user={profile} />
				<UserSidebar isCurrentUser={isCurrentUser} />
				{photos && photos.length > 0 && <UserPhotos photos={photos} />}
				<UserEvents />
			</Grid>
		);
	}
}

export default compose(
	connect(mapState),
	firestoreConnect(props => query(props))
)(UserDetailedPage);
