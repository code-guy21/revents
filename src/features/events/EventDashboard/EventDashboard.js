import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import EventList from "../EventList/EventList";
import { connect } from "react-redux";
import { getEvents, deleteEvent } from "../../../actions/index";

class EventDashboard extends Component {
  handleDeleteEvent = eventId => () => {
    this.props.deleteEvent(eventId, () => {
      this.props.history.push("/events");
    });
  };

  render() {
    console.log(this.props.events);
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            deleteEvent={this.handleDeleteEvent}
            events={this.props.events}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events
  };
}

export default connect(
  mapStateToProps,
  { getEvents, deleteEvent }
)(EventDashboard);
