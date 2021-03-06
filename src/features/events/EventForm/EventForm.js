/*global google*/
import React, { Component } from 'react';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import { reduxForm, Field } from 'redux-form';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import {
	composeValidators,
	combineValidators,
	isRequired,
	hasLengthGreaterThan
} from 'revalidate';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Script from 'react-load-script';
import moment from 'moment';

const mapState = (state, ownProps) => {
	if (ownProps.match.path === '/createEvent') {
		return { initialValues: {} };
	}

	let event = {};

	if (state.firestore.ordered.events && state.firestore.ordered.events[0]) {
		event = state.firestore.ordered.events[0];
	}

	if (event.date) {
		var newDate = {
			date: event.date.toDate()
		};
	}

	return {
		initialValues: { ...event, ...newDate },
		event,
		loading: state.async.loading
	};
};

const category = [
	{ key: 'drinks', text: 'Drinks', value: 'drinks' },
	{ key: 'culture', text: 'Culture', value: 'culture' },
	{ key: 'film', text: 'Film', value: 'film' },
	{ key: 'food', text: 'Food', value: 'food' },
	{ key: 'music', text: 'Music', value: 'music' },
	{ key: 'travel', text: 'Travel', value: 'travel' }
];

const validate = combineValidators({
	title: isRequired({ message: 'The event title is required' }),
	category: isRequired({ message: 'Please provide a category' }),
	description: composeValidators(
		isRequired({ message: 'Please enter a description' }),
		hasLengthGreaterThan(4)({
			message: 'Description needs to be at least 5 characters'
		})
	)(),
	city: isRequired('city'),
	venue: isRequired('venue'),
	date: isRequired('date')
});

class EventForm extends Component {
	state = {
		cityLatLng: {},
		venueLatLng: {},
		scriptLoaded: false
	};

	async componentDidMount() {
		const { firestore, match } = this.props;
		await firestore.setListener(`events/${match.params.id}`);
	}

	async componentWillUnmount() {
		const { firestore, match } = this.props;
		await firestore.unsetListener(`events/${match.params.id}`);
	}

	handleScriptLoaded = () => {
		this.setState({ scriptLoaded: true });
	};

	handleCitySelect = selectedCity => {
		geocodeByAddress(selectedCity)
			.then(results => getLatLng(results[0]))
			.then(latlng => {
				this.setState({
					cityLatLng: latlng
				});
			})
			.then(() => {
				this.props.change('city', selectedCity);
			});
	};

	handleVenueSelect = selectedVenue => {
		geocodeByAddress(selectedVenue)
			.then(results => getLatLng(results[0]))
			.then(latlng => {
				this.setState({
					venueLatLng: latlng
				});
			})
			.then(() => {
				this.props.change('venue', selectedVenue);
			});
	};

	onFormSubmit = async values => {
		values.venueLatLng = this.state.venueLatLng;
		values.date = moment(values.date).toDate();

		if (this.props.initialValues.id) {
			if (Object.keys(values.venueLatLng).length === 0) {
				values.venueLatLng = this.props.event.venueLatLng;
			}
			await this.props.updateEvent(values);
			this.props.history.push('/events');
		} else {
			this.props.createEvent(values, id => {
				this.props.history.push(`/event/${id}`);
			});
		}
	};

	render() {
		const {
			invalid,
			submitting,
			pristine,
			event,
			cancelToggle,
			loading
		} = this.props;
		return (
			<Grid>
				<Script
					url={`https://maps.googleapis.com/maps/api/js?key=${
						process.env.REACT_APP_GOOGLE_KEY
					}&libraries=places`}
					onLoad={this.handleScriptLoaded}
				/>
				<Grid.Column width={10}>
					<Segment>
						<Header sub color="teal" content="Event Details" />
						<Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
							<Field
								name="title"
								type="text"
								component={TextInput}
								placeholder="Give your event a name"
							/>
							<Field
								name="category"
								type="text"
								rows={3}
								component={SelectInput}
								options={category}
								placeholder="What is your event about"
							/>
							<Field
								name="description"
								type="text"
								component={TextArea}
								placeholder="Tell us about your event"
							/>
							<Header sub color="teal" content="Event Location Details" />
							<Field
								name="city"
								type="text"
								component={PlaceInput}
								options={{ types: ['(cities)'] }}
								placeholder="Event City"
								onSelect={this.handleCitySelect}
							/>
							{this.state.scriptLoaded && (
								<Field
									name="venue"
									type="text"
									component={PlaceInput}
									options={{
										location: new google.maps.LatLng(this.state.cityLatLng),
										radius: 1000,
										types: ['establishment']
									}}
									placeholder="Event Venue"
									onSelect={this.handleVenueSelect}
								/>
							)}
							<Field
								name="date"
								type="text"
								component={DateInput}
								dateFormat="YYYY-MM-DD HH:mm"
								timeFormat="HH:mm"
								showTimeSelect
								placeholder="Date and Time of event"
							/>
							<Button
								loading={loading}
								disabled={invalid || submitting || pristine}
								positive
								type="submit"
							>
								Submit
							</Button>
							<Button
								disabled={loading}
								onClick={this.props.history.goBack}
								type="button"
							>
								Cancel
							</Button>
							{event && (
								<Button
									onClick={() => cancelToggle(!event.cancelled, event.id)}
									type="button"
									color={event.cancelled ? 'green' : 'red'}
									floated="right"
									content={
										event.cancelled ? 'Reactivate Event' : 'Cancel event'
									}
								/>
							)}
						</Form>
					</Segment>
				</Grid.Column>
			</Grid>
		);
	}
}

export default withFirestore(
	connect(
		mapState,
		{ createEvent, updateEvent, cancelToggle }
	)(
		reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(
			EventForm
		)
	)
);
