import React, { useContext, useState, useRef } from 'react';
import { Card, Grid, Transition, Image, Label, Icon, Button, Form } from 'semantic-ui-react';
import { useQuery, useMutation } from '@apollo/client';
import { AuthContext } from '../context/auth';
import gql from 'graphql-tag';
import moment from 'moment';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { FETCH_POST_QUERY } from '../util/graphql';
import { useParams, useNavigate } from 'react-router-dom';

function SinglePost() {
    const { postId } = useParams();
    const { loading, data } = useQuery(FETCH_POST_QUERY, {
        variables: { postId }
    });
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);
    const [comment, setComment] = useState('');

    const [submitComment] = useMutation(CREATE_COMMENT, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    });

    let post = null;

    if (data) {
        post = data.getPost;
    }

    return (
        <>
            {loading || !post ? (<h1> Loading posts...</h1 >) : (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Image src='https://react.semantic-ui.com/images/avatar/large/molly.png' size='small' float='right' />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>{post.username}</Card.Header>
                                    <Card.Meta>{moment(post.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{post.body}</Card.Description>
                                </Card.Content>
                                <hr />
                                <Card.Content extra>
                                    <LikeButton user={user} post={post} />
                                    <Button as='div' labelPosition='right' onClick={() => console.log('comment on post')} >
                                        <Button basic color='blue'>
                                            <Icon name='comments' />

                                        </Button>
                                        <Label basic color='blue' pointing='left'>{post.comments.length}</Label>
                                    </Button>
                                    {
                                        user && user.username === post.username &&
                                        <DeleteButton post={post} onDeleted={() => navigate('/')} />
                                    }
                                </Card.Content>
                            </Card>
                            {
                                user && (
                                    <Card fluid>
                                        <Card.Content>
                                            <p>Post a comment</p>
                                            <Form>
                                                <div className='ui action input fluid'>
                                                    <input
                                                        type='text' placeholder='Comment...' name='comment' value={comment} onChange={(event) => setComment(event.target.value)}
                                                        ref={commentInputRef}
                                                    />
                                                    <button type='submit' className='ui button teal'
                                                        disabled={!comment.trim()}
                                                        onClick={submitComment}>Submit</button>
                                                </div>
                                            </Form>
                                        </Card.Content>
                                    </Card>
                                )
                            }
                            <Transition.Group>
                                {
                                    post.comments.map(comment => (
                                        <Card fluid key={comment.id}>
                                            <Card.Content>
                                                {
                                                    user && user.username === comment.username && <DeleteButton post={{ id: post.id }} comment={{ id: comment.id }} />
                                                }
                                                <Card.Header>
                                                    {comment.username}
                                                </Card.Header>
                                                <Card.Meta>
                                                    {moment(comment.createdAt).fromNow()}
                                                </Card.Meta>
                                                <Card.Description>
                                                    {comment.body}
                                                </Card.Description>
                                            </Card.Content>
                                        </Card>
                                    ))
                                }
                            </Transition.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )}
        </>
    );
}
const CREATE_COMMENT = gql`
    mutation createComment($postId: ID!, $body: String!) {
        createComment(postId: $postId, body: $body) {
            id # need it so that apollo knows which post to update
            comments {
                id body createdAt username
            }
        }
    }
`;
export default SinglePost;
