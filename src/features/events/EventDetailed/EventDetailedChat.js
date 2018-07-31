import React, { Component } from 'react';
import { Segment, Header, Comment } from 'semantic-ui-react';
import EventDetailedChatForm from './EventDetailedChatForm';
import { Link } from 'react-router-dom';
import distanceInWords from 'date-fns/distance_in_words';

class EventDetailedChat extends Component {
	state = {
		showReplyForm: false,
		selectedCommentId: null
	};

	handleOpenReplyForm = id => () => {
		let sameComment = false;

		if (id === this.state.selectedCommentId) {
			sameComment = true;
		}

		this.setState({
			showReplyForm: !this.state.showReplyForm,
			selectedCommentId: id
		});

		if (!sameComment) {
			this.setState({
				showReplyForm: true
			});
		}
	};

	handleCloseReplyForm = () => {
		this.setState({ selectedCommentId: null, showReplyForm: false });
	};

	render() {
		const { eventChat, eventId, addEventComment } = this.props;
		const { showReplyForm, selectedCommentId } = this.state;
		return (
			<div>
				<Segment
					textAlign="center"
					attached="top"
					inverted
					color="teal"
					style={{ border: 'none' }}
				>
					<Header>Chat about this event</Header>
				</Segment>

				<Segment attached>
					<Comment.Group>
						{eventChat &&
							eventChat.map(comment => {
								return (
									<Comment key={comment.id}>
										<Comment.Avatar src={comment.photoURL} />
										<Comment.Content>
											<Comment.Author to={`/profile/${comment.uid}`} as={Link}>
												{comment.displayName}
											</Comment.Author>
											<Comment.Metadata>
												<div>
													{distanceInWords(comment.date, Date.now())} ago
												</div>
											</Comment.Metadata>
											<Comment.Text>{comment.text}</Comment.Text>
											<Comment.Actions>
												<Comment.Action
													onClick={this.handleOpenReplyForm(comment.id)}
												>
													Reply
												</Comment.Action>
												{showReplyForm &&
													selectedCommentId === comment.id && (
														<EventDetailedChatForm
															eventId={eventId}
															addEventComment={addEventComment}
															form={`reply_${comment.id}`}
															closeForm={this.handleCloseReplyForm}
															parentId={comment.id}
														/>
													)}
											</Comment.Actions>
										</Comment.Content>
										<Comment.Group>
											{comment.childNodes &&
												comment.childNodes.map(child => {
													return (
														<Comment key={child.id}>
															<Comment.Avatar src={child.photoURL} />
															<Comment.Content>
																<Comment.Author
																	to={`/profile/${child.uid}`}
																	as={Link}
																>
																	{child.displayName}
																</Comment.Author>
																<Comment.Metadata>
																	<div>
																		{distanceInWords(child.date, Date.now())}{' '}
																		ago
																	</div>
																</Comment.Metadata>
																<Comment.Text>{child.text}</Comment.Text>
																<Comment.Actions>
																	<Comment.Action
																		onClick={this.handleOpenReplyForm(child.id)}
																	>
																		Reply
																	</Comment.Action>
																	{showReplyForm &&
																		selectedCommentId === child.id && (
																			<EventDetailedChatForm
																				eventId={eventId}
																				addEventComment={addEventComment}
																				form={`reply_${child.id}`}
																				closeForm={this.handleCloseReplyForm}
																				parentId={child.parentId}
																			/>
																		)}
																</Comment.Actions>
															</Comment.Content>
														</Comment>
													);
												})}
										</Comment.Group>
									</Comment>
								);
							})}
					</Comment.Group>
					<EventDetailedChatForm
						eventId={eventId}
						addEventComment={addEventComment}
						form={'newComment'}
						parentId={0}
					/>
				</Segment>
			</div>
		);
	}
}

export default EventDetailedChat;
