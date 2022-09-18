import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
    query {
        getPosts {
            id body createdAt username
            likes {
                username
            }
            comments {
                id username createdAt body
            }
        }
    }
`;

export const FETCH_POST_QUERY = gql`
    query getPost($postId: ID!){
        getPost(postId: $postId) {
            id
            body
            username
            createdAt
            comments {
                id
                username
                createdAt
                body
            }
            likes {
                username
                createdAt
            }
        }
    }
`