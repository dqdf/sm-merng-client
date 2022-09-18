import React, { useContext, useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useForm } from '../util/hooks';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';

function Register() {
    const context = useContext(AuthContext);
    const navigate = useNavigate();

    const { values, onSubmit, onChange } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            setErrors({});
            context.login(result.data.register);
            navigate('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        variables: {
            registerInput: values
        }
    });

    function registerUser() {
        addUser();
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Register</h1>
                <Form.Input type='text' label='Username' placeholder='Username'
                    name='username' value={values.username} onChange={onChange} error={Boolean(errors.username)} />
                <Form.Input type='email' label='Email' placeholder='Email' name='email' value={values.email} onChange={onChange} error={Boolean(errors.email)} />
                <Form.Input type='password' label='Password' placeholder='Password' name='password' value={values.password} onChange={onChange} error={Boolean(errors.password)} />
                <Form.Input type='password' label='Confirm Password' placeholder='Confirm Password' name='confirmPassword' value={values.confirmPassword} onChange={onChange} error={Boolean(errors.confirmPassword)} />
                <Button type='submit' primary>Register</Button>
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

const REGISTER_USER = gql`
    mutation register($registerInput: RegisterInput) {
        register(registerInput: $registerInput) {
            username
            token
            email
            id
            createdAt
        }
    }
`
export default Register;
