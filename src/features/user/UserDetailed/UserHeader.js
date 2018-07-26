import React from 'react';
import { Grid, Segment, Item, Header } from 'semantic-ui-react';
import moment from 'moment';

const UserHeader = ({ user }) => {
	let age;
	if (user.dateOfBirth) {
		age = moment().diff(user.dateOfBirth, 'years');
	}
	return (
		<Grid.Column width={16}>
			<Segment>
				<Item.Group>
					<Item>
						<Item.Image avatar size="small" src={user.photoURL} />
						<Item.Content verticalAlign="bottom">
							<Header as="h1">{user.displayName}</Header>
							<br />
							<Header as="h3">{user.occupation}</Header>
							<br />
							<Header as="h3">
								{`${age || 'Uknown age'}, Lives in ${user.city ||
									'Uknown city'}`}
							</Header>
						</Item.Content>
					</Item>
				</Item.Group>
			</Segment>
		</Grid.Column>
	);
};

export default UserHeader;
