import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import { objectToArray } from '../../../app/common/util/helpers';
import { compose } from 'redux';
import { joinEvent, cancelJoin } from '../../user/userActions';

const query = props => {
	return [
		{
			collection: 'events',
			doc: props.match.params.id,
			storeAs: 'events'
		}
	];
};

const actions = {
	joinEvent,
	cancelJoin
};

const mapState = state => {
	let event;

	if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
		event = state.firestore.ordered.events[0];
	}
	return { auth: state.firebase.auth, event };
};

class EventDetailedPage extends Component {
	render() {
		const { event, auth, joinEvent, cancelJoin } = this.props;
		const attendees =
			event && event.attendees && objectToArray(event.attendees);
		const isHost = event && event.hostUid === auth.uid;
		const isGoing = attendees && attendees.some(a => a.id === auth.uid);
		return (
			<div>
				{event && (
					<Grid>
						<Grid.Column width={10}>
							<EventDetailedHeader
								isGoing={isGoing}
								isHost={isHost}
								event={event}
								joinEvent={joinEvent}
								cancelJoin={cancelJoin}
							/>
							<EventDetailedInfo event={event} />
							<EventDetailedChat />
						</Grid.Column>
						<Grid.Column width={6}>
							<EventDetailedSidebar attendees={attendees} />
						</Grid.Column>
					</Grid>
				)}
				<div />
			</div>
		);
	}
}

export default compose(
	connect(
		mapState,
		actions
	),
	firestoreConnect(props => query(props))
)(EventDetailedPage);
