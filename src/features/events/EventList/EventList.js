import React, { Component } from "react";
import EventListItem from "./EventListItem";

class EventList extends Component {
  render() {
    return (
      <div>
        {this.props.events.map(event => (
          <EventListItem
            deleteEvent={this.props.deleteEvent}
            editEvent={this.props.editEvent}
            key={event.id}
            event={event}
          />
        ))}
      </div>
    );
  }
}

export default EventList;
