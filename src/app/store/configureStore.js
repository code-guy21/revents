import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers/index';
import ReduxPromise from 'redux-promise';

export const configureStore = preloadedState => {
	const middlewares = [ReduxPromise];
	const middlewareEnhancer = applyMiddleware(...middlewares);

	const storeEnhancers = [middlewareEnhancer];

	const composedEnhancer = composeWithDevTools(...storeEnhancers);

	const store = createStore(rootReducer, preloadedState, composedEnhancer);

	return store;
};
