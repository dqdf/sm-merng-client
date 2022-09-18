import React, { useState } from 'react';
import { Icon, Button, Confirm } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { FETCH_POSTS_QUERY, FETCH_POST_QUERY } from '../util/graphql';

function DeleteButton(props) {
    const { id: postId } = props.post;
    const { id: commentId } = props.comment || { id: null };
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;


    const [deletePostOrComment] = useMutation(mutation, {
        variables: { postId, commentId },
        update(proxy, result) {
            setConfirmOpen(false);
            if (!commentId) {
                updatePostsCache(proxy);
            } else {
                updateSinglePostCache(proxy);
            }

            if (props.onDeleted) {
                props.onDeleted();
            }
        }
    });

    function updatePostsCache(proxy) {
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
        const updatedData = {
            ...data,
            getPosts: data.getPosts.filter(p => p.id !== postId)
        };
        proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: updatedData
        });
    }

    function updateSinglePostCache(proxy) {
        const data = proxy.readQuery({ query: FETCH_POST_QUERY, variables: { postId } });
        const updatedData = {
            ...data,
            getPost: {
                ...data.getPost,
                comments: data.getPost.comments.filter(c => c.id !== commentId)
            }
        };
        proxy.writeQuery({
            query: FETCH_POST_QUERY,
            data: updatedData
        });
    }

    return (
        <>
            <Button icon color='red' floated='right' onClick={() => setConfirmOpen(true)}>
                <Icon name='trash' />
            </Button>
            <Confirm
                size='mini'
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrComment} />
        </>
    );
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId) {
            id
        }
    }
`;

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            body
            username
            createdAt
        }
    }
`;

export default DeleteButton;


