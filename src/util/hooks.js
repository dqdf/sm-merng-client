import { useState } from 'react';

export const useForm = (callback, initialState = {}) => {
    const [values, setValues] = useState(initialState);
    const onChange = (event) => {
        setValues((oldVal) => ({ ...oldVal, [event.target.name]: event.target.value }));
    }
    const onSubmit = (event) => {
        event.preventDefault();
        callback();
    }
    return {
        onChange,
        onSubmit,
        values,
        setValues
    };
}