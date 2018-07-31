import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
	firestoreConnect,
	firebaseConnect,
	isEmpty
} from 'react-redux-firebase';
import { compose } from 'redux';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSidebar from './EventDetailedSidebar';
import {
	objectToArray,
	createDataTree
} from '../../../app/common/util/helpers';
import { joinEvent, cancelJoin } from '../../user/userActions';
import { addEventComment } from '../../events/eventActions';

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
	cancelJoin,
	addEventComment
};

const mapState = (state, ownProps) => {
	let event;
	let eventChat;

	if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
		event = state.firestore.ordered.events[0];
	}

	if (state.firebase.data.event_chat) {
		eventChat = objectToArray(
			state.firebase.data.event_chat[ownProps.match.params.id]
		);
	}
	return { auth: state.firebase.auth, event, eventChat };
};

class EventDetailedPage extends Component {
	render() {
		const {
			event,
			auth,
			joinEvent,
			cancelJoin,
			addEventComment,
			eventChat
		} = this.props;
		const attendees =
			event && event.attendees && objectToArray(event.attendees);
		const isHost = event && event.hostUid === auth.uid;
		const isGoing = attendees && attendees.some(a => a.id === auth.uid);
		const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
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
							<EventDetailedChat
								eventChat={chatTree}
								eventId={event.id}
								addEventComment={addEventComment}
							/>
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
	firebaseConnect(props => [`event_chat/${props.match.params.id}`]),
	connect(
		mapState,
		actions
	),
	firestoreConnect(props => query(props))
)(EventDetailedPage);
