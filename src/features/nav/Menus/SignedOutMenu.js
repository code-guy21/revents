import React from 'react';
import { Menu, Button } from 'semantic-ui-react';

const SignedOutMenu = ({ login }) => {
	return (
		<Menu.Item position="right">
			<Button
				onClick={login}
				basic
				inverted
				content="Login"
				style={{ marginLeft: '0.5em' }}
			/>
			<Button
				basic
				inverted
				content="Register"
				style={{ marginLeft: '0.5em' }}
			/>
		</Menu.Item>
	);
};

export default SignedOutMenu;
