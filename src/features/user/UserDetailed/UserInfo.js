import React from 'react';
import { Grid, Segment, Header, List, Item, Icon } from 'semantic-ui-react';
import format from 'date-fns/format';

const UserInfo = ({ user }) => {
	let createdAt;
	if (user.createdAt) {
		createdAt = format(user.createdAt.toDate(), 'D MMM YYYY');
	}
	return (
		<Grid.Column width={12}>
			<Segment>
				<Grid columns={2}>
					<Grid.Column width={10}>
						<Header icon="smile" content={`About ${user.displayName}`} />
						<p>
							I am a:{' '}
							<strong>{user.occupation ? user.occupation : 'tbn'}</strong>
						</p>
						<p>
							Originally from{' '}
							<strong>{user.origin ? user.origin : 'tbn'}</strong>
						</p>
						<p>
							Member Since: <strong>{createdAt}</strong>
						</p>
						<p>{user.about}</p>
					</Grid.Column>
					<Grid.Column width={6}>
						<Header icon="heart outline" content="Interests" />
						<List>
							{user.interests
								? user.interests.map((interest, i) => {
										return (
											<Item key={i}>
												<Icon name="heart" />
												<Item.Content>{interest}</Item.Content>
											</Item>
										);
								  })
								: 'No interests'}
						</List>
					</Grid.Column>
				</Grid>
			</Segment>
		</Grid.Column>
	);
};

export default UserInfo;
