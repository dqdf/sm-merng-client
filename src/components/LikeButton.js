import React, { useState, useContext, useEffect } from 'react';
import { Icon, Label, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { AuthContext } from '../context/auth';

function LikeButton(props) {
    const { id, likes } = props.post;
    const { user } = useContext(AuthContext);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        setLiked(Boolean(user) && likes.some(like => like.username === user.username));
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id },
        update(proxy, result) {
            console.log(result);
        }
    });

    const likeButton = user ? (
        liked ? (
            <Button color='red' onClick={likePost}>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='red' basic onClick={likePost}>
                <Icon name='heart' />
            </Button >
        )
    ) : (
        <Button as={Link} to='login' color='red' basic onClick={likePost}>
            <Icon name='heart' />
        </Button >
    )

    return (
        <Button as='div' labelPosition='right' >
            {likeButton}
            <Label basic color='red' pointing='left'>
                {likes.length}
            </Label>
        </Button>
    );
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId) {
            id
            likes {
                id username
            }
        }
    }
`;

export default LikeButton;


