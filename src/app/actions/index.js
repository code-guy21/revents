import { GET_EVENTS, CREATE_EVENT, DELETE_EVENT } from "../constants/constants";

export const getEvents = () => {
  return {
    type: GET_EVENTS,
    payload: []
  };
};

export const deleteEvent = eventId => {
  return {
    type: DELETE_EVENT,
    payload: eventId
  };
};

export const createEvent = (event, callback) => {
  callback();
  return {
    type: CREATE_EVENT,
    payload: event
  };
};
