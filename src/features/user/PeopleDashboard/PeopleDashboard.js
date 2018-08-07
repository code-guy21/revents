import React, { Component } from 'react';
import { Grid, Segment, Header, Card } from 'semantic-ui-react';
import PersonCard from './PersonCard';
import { withFirestore } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { objectToArray } from '../../../app/common/util/helpers';

const mapState = state => {
	let following;
	let followers;

	if (state.firestore.data.users) {
		if (state.firestore.data.users[`${state.firebase.auth.uid}`]) {
			if (state.firestore.data.users[`${state.firebase.auth.uid}`].following) {
				following = objectToArray(
					state.firestore.data.users[`${state.firebase.auth.uid}`].following
				);
			}
		}
	}

	if (state.firestore.data.users) {
		if (state.firestore.data.users[`${state.firebase.auth.uid}`]) {
			if (state.firestore.data.users[`${state.firebase.auth.uid}`].followers) {
				followers = objectToArray(
					state.firestore.data.users[`${state.firebase.auth.uid}`].followers
				);
			}
		}
	}

	return {
		auth: state.firebase.auth,
		followers: followers,
		following: following
	};
};

class PeopleDashboard extends Component {
	async componentDidMount() {
		const { firestore, auth } = this.props;
		await firestore.get(`users/${auth.uid}/following`);
		await firestore.get(`users/${auth.uid}/followers`);
	}
	render() {
		const { followers, following } = this.props;

		return (
			<Grid>
				<Grid.Column width={16}>
					<Segment>
						<Header dividing content="People following me" />
						<Card.Group itemsPerRow={8} stackable>
							{followers &&
								followers.map(user => {
									return <PersonCard key={user.id} user={user} />;
								})}
						</Card.Group>
					</Segment>
					<Segment>
						<Header dividing content="People I'm following" />
						<Card.Group itemsPerRow={8} stackable>
							{following &&
								following.map(user => {
									return <PersonCard key={user.id} user={user} />;
								})}
						</Card.Group>
					</Segment>
				</Grid.Column>
			</Grid>
		);
	}
}

export default withFirestore(connect(mapState)(PeopleDashboard));
