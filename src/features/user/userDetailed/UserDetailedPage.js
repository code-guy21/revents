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
import { getUserEvents } from '../userActions';

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

const mapState = (state, ownProps) => {
	let user = {};

	if (state.firestore.ordered.profile) {
		user = state.firestore.ordered.profile[0];
	}

	return {
		auth: state.firebase.auth,
		profile: user,
		userUid: ownProps.match.params.id,
		photos: state.firestore.ordered.photos,
		requesting: state.firestore.status.requesting,
		events: state.events,
		eventsLoading: state.async.loading
	};
};

const actions = {
	getUserEvents
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
			events,
			eventsLoading
		} = this.props;
		const isCurrentUser = profile.id === auth.uid;
		const loading = Object.values(requesting).some(a => a === true);

		if (loading) return <LoadingComponent inverted={true} />;
		return (
			<Grid>
				<UserHeader user={profile} />
				<UserInfo user={profile} />
				<UserSidebar isCurrentUser={isCurrentUser} />
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
