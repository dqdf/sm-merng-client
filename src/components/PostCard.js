import React, { useContext } from 'react';
import { Card, Image, Icon, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

function PostCard(props) {
    const { body, createdAt, id, username, likes, comments } = props.post;

    const { user } = useContext(AuthContext);

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                {
                    (user && user.username !== username || !user) &&
                    <LikeButton post={{ id, likes }} />
                }
                <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                    <Button color='teal' basic >
                        <Icon name='comments' />
                    </Button>
                    <Label basic color='teal' pointing='left'>
                        {comments.length}
                    </Label>
                </Button>
                {
                    user && user.username === username &&
                    <DeleteButton post={{ id }} />
                }
            </Card.Content>
        </Card>
    );
}

export default PostCard;
