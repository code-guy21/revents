import React from 'react';
import { Grid, Segment, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const UserSidebar = ({
	isCurrentUser,
	followUser,
	profile,
	auth,
	isFollowing,
	unfollowUser
}) => {
	return (
		<Grid.Column width={4}>
			<Segment>
				{isCurrentUser ? (
					<Button
						to="/settings"
						as={Link}
						color="teal"
						fluid
						basic
						content="Edit Profile"
					/>
				) : !isFollowing ? (
					<Button
						onClick={() => followUser(profile, auth)}
						color="teal"
						fluid
						basic
						content="Follow User"
					/>
				) : (
					<Button
						onClick={() => unfollowUser(profile, auth)}
						color="teal"
						fluid
						basic
						content="Unfollow User"
					/>
				)}
			</Segment>
		</Grid.Column>
	);
};

export default UserSidebar;
