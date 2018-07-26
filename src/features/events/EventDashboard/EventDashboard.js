import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import { connect } from 'react-redux';
import { deleteEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';
import { withFirestore } from 'react-redux-firebase';

class EventDashboard extends Component {
	async componentDidMount() {
		const { firestore } = this.props;
		await firestore.setListener(`events`);
	}

	async componentWillUnmount() {
		const { firestore } = this.props;
		await firestore.unsetListener(`events`);
	}

	handleDeleteEvent = eventId => () => {
		this.props.deleteEvent(eventId);
	};

	render() {
		const { events, loading } = this.props;
		if (loading) return <LoadingComponent inverted={true} />;
		return (
			<Grid>
				<Grid.Column width={10}>
					<EventList deleteEvent={this.handleDeleteEvent} events={events} />
				</Grid.Column>
				<Grid.Column width={6}>
					<EventActivity />
				</Grid.Column>
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		events: state.firestore.ordered.events,
		loading: state.async.loading
	};
};

export default withFirestore(
	connect(
		mapStateToProps,
		{ deleteEvent }
	)(EventDashboard)
);
