import React, { Component } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { createEvent } from "../../../actions/index";
import cuid from "cuid";

const emptyState = {
  title: "",
  date: "",
  city: "",
  venue: "",
  hostedBy: "",
  id: cuid(),
  hostPhotoURL: "/assets/user.png"
};

class EventForm extends Component {
  state = {
    event: emptyState
  };

  onFormSubmit = event => {
    event.preventDefault();
    this.props.createEvent(this.state.event, () => {
      this.props.history.push("/events");
    });
  };

  onInputChange = event => {
    const newEvent = { ...this.state.event };
    newEvent[event.target.name] = event.target.value;
    this.setState({
      event: newEvent
    });
  };

  render() {
    return (
      <Segment>
        <Form onSubmit={this.onFormSubmit}>
          <Form.Field>
            <label>Event Title</label>
            <input
              onChange={this.onInputChange}
              value={this.state.event.title}
              name="title"
              placeholder="Event Title"
            />
          </Form.Field>
          <Form.Field>
            <label>Event Date</label>
            <input
              onChange={this.onInputChange}
              name="date"
              value={this.state.event.date}
              type="date"
              placeholder="Event Date"
            />
          </Form.Field>
          <Form.Field>
            <label>City</label>
            <input
              name="city"
              value={this.state.event.city}
              onChange={this.onInputChange}
              placeholder="City event is taking place"
            />
          </Form.Field>
          <Form.Field>
            <label>Venue</label>
            <input
              name="venue"
              value={this.state.event.venue}
              onChange={this.onInputChange}
              placeholder="Enter the Venue of the event"
            />
          </Form.Field>
          <Form.Field>
            <label>Hosted By</label>
            <input
              name="hostedBy"
              value={this.state.event.hostedBy}
              onChange={this.onInputChange}
              placeholder="Enter the name of person hosting"
            />
          </Form.Field>
          <Button positive type="submit">
            Submit
          </Button>
          <Button type="button">Cancel</Button>
        </Form>
      </Segment>
    );
  }
}

export default connect(
  null,
  { createEvent }
)(EventForm);
