import React, { useContext, useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useForm } from '../util/hooks';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';

function Login() {
    const context = useContext(AuthContext);
    const navigate = useNavigate();
    const { values, onSubmit, onChange } = useForm(login, {
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            setErrors({});
            context.login(result.data.login);
            navigate('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        variables: values
    });

    function login() {
        loginUser();
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input type='text' label='Username' placeholder='Username'
                    name='username' value={values.username} onChange={onChange} error={Boolean(errors.username)} />
                <Form.Input type='password' label='Password' placeholder='Password' name='password' value={values.password} onChange={onChange} error={Boolean(errors.password)} />
                <Button type='submit' primary>Login</Button>
            </Form>
            {Boolean(Object.keys(errors).length) &&
                <div className='ui error message'>
                    <ul className='list'>
                        {Object.values(errors).map(err => <li key={err}>{err}</li>)}
                    </ul>
                </div>
            }
        </div>
    );
}

const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            id
            email
            token
            username
            createdAt
        }
    }
`
export default Login;
