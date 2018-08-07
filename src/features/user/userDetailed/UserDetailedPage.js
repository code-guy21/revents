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
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents, followUser, unfollowUser } from '../userActions';

const query = ({ match, authUser }) => {
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
		},
		{
			collection: 'users',
			doc: authUser.uid,
			subcollections: [
				{
					collection: 'following',
					doc: match.params.id
				}
			],
			storeAs: 'following'
		}
	];
};

const mapState = (state, ownProps) => {
	let user = {};

	if (state.firestore.ordered.profile) {
		user = state.firestore.ordered.profile[0];
	}

	return {
		authUser: state.firebase.auth,
		auth: state.firebase.profile,
		profile: user,
		userUid: ownProps.match.params.id,
		photos: state.firestore.ordered.photos,
		requesting: state.firestore.status.requesting,
		events: state.events,
		eventsLoading: state.async.loading,
		following: state.firestore.ordered.following
	};
};

const actions = {
	getUserEvents,
	followUser,
	unfollowUser
};

class UserDetailedPage extends Component {
	async componentDidMount() {
		await this.props.getUserEvents(this.props.userUid);
	}

	changeTab = (e, data) => {
		this.props.getUserEvents(this.props.userUid, data.activeIndex);
	};

	render() {
		const {
			profile,
			photos,
			auth,
			requesting,
			following,
			userUid,
			events,
			followUser,
			eventsLoading,
			unfollowUser
		} = this.props;

		let isCurrentUser;
		if (profile) {
			isCurrentUser = profile.id === auth.uid;
		} else {
			isCurrentUser = false;
		}

		const loading = requesting[`users/${userUid}`];
		const isFollowing = following && following.length !== 0;

		if (loading) return <LoadingComponent inverted={true} />;

		if (!profile) return <div />;
		return (
			<Grid>
				<UserHeader user={profile} />
				<UserInfo user={profile} />
				<UserSidebar
					unfollowUser={unfollowUser}
					isFollowing={isFollowing}
					auth={auth}
					profile={profile}
					followUser={followUser}
					isCurrentUser={isCurrentUser}
				/>
				{photos && photos.length > 0 && <UserPhotos photos={photos} />}
				<UserEvents
					changeTab={this.changeTab}
					events={events}
					eventsLoading={eventsLoading}
				/>
			</Grid>
		);
	}
}

export default compose(
	connect(
		mapState,
		actions
	),
	firestoreConnect(props => query(props))
)(UserDetailedPage);
