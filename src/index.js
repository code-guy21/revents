import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './app/layout/App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStore } from './app/store/configureStore';
import ScrollToTop from './app/common/util/ScrollToTop';
import { loadEvents } from './features/events/eventActions';

const store = configureStore();
store.dispatch(loadEvents());

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<ScrollToTop>
				<App />
			</ScrollToTop>
		</Router>
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();
