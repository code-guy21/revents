import { combineReducers } from "redux";
import eventReducer from "../.././features/events/event_reducer";

const rootReducer = combineReducers({
  events: eventReducer
});

export default rootReducer;
