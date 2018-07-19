import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import SettingsNav from './SettingsNav';
import { Switch, Route, Redirect } from 'react-router-dom';
import AboutPage from './AboutPage';
import AccountPage from './AccountPage';
import PhotosPage from './PhotosPage';
import BasicPage from './BasicPage';
import { updatePassword } from '../../auth/authActions';

const actions = {
	updatePassword
};

const mapState = state => {
	return {
		providerId: state.firebase.auth.providerData[0].providerId
	};
};

const SettingsDashboard = ({ updatePassword, providerId }) => {
	return (
		<Grid>
			<Grid.Column width={12}>
				<Switch>
					<Redirect exact from="/settings" to="/settings/basic" />
					<Route path="/settings/basic" component={BasicPage} />
					<Route path="/settings/about" component={AboutPage} />
					<Route path="/settings/photos" component={PhotosPage} />
					<Route
						path="/settings/account"
						render={() => (
							<AccountPage
								providerId={providerId}
								updatePassword={updatePassword}
							/>
						)}
					/>
				</Switch>
			</Grid.Column>
			<Grid.Column width={4}>
				<SettingsNav />
			</Grid.Column>
		</Grid>
	);
};

export default connect(
	mapState,
	actions
)(SettingsDashboard);
