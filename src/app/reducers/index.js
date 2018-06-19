import { combineReducers } from "redux";
import EventReducer from "./event_reducer";

const rootReducer = combineReducers({
  events: EventReducer
});

export default rootReducer;
