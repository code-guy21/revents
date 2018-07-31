import React from 'react';
import { Grid, Segment, Item, Header } from 'semantic-ui-react';
import differenceInYears from 'date-fns/difference_in_years';

const UserHeader = ({ user }) => {
	let age;
	if (user.dateOfBirth) {
		age = differenceInYears(Date.now(), user.dateOfBirth.toDate());
	}
	return (
		<Grid.Column width={16}>
			<Segment>
				<Item.Group>
					<Item>
						<Item.Image
							avatar
							size="small"
							src={user.photoURL || '/assets/user.png'}
						/>
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
