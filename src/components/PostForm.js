import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm(props) {
    const { values, onChange, onSubmit } = useForm(createPost, {
        body: ''
    });
    const [errorMessage, setErrorMessage] = useState({});


    const [create, { error }] = useMutation(CREATE_POST, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            const updatedData = {
                ...data,
                getPosts: [result.data.createPost, ...data.getPosts]
            };
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: updatedData
            });
            values.body = '';
        },
        onError(err) {
            if (err.graphQLErrors && err.graphQLErrors.length) {
                setErrorMessage(err.graphQLErrors[0].message);
            }
        },
        variables: values
    })

    function createPost() {
        create();
    }

    return (
        <><Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
            <Form.Field>
                <Form.Input placeholder='Hi World!' name='body' onChange={onChange} value={values.body} error={Boolean(error)} />
                <Button type='submit' color='teal'>Submit</Button>
            </Form.Field>
        </Form>
            {
                error && (
                    <div className='ui error message' style={{ marginBottom: 14 }}>
                        <ul className='list'>
                            <li>{errorMessage}</li>
                        </ul>
                    </div>
                )
            }
        </>
    );
}

const CREATE_POST = gql`
    mutation createPost($body: String!) {
        createPost(body: $body) {
            id
            body
            username
            createdAt
            likes {
                id
                username
                createdAt
            }
            comments {
                id
                body
                username
                createdAt
            }
        }
    }
`;

export default PostForm;
