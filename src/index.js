import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const setAuthorizationLink = setContext((gqlRequest, previousContext) => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { authorization: token ? `Bearer ${token}` : '' }
  };
});

const httpLink = new HttpLink({
  uri: 'https://sm-merng-server.onrender.com',

});
const client = new ApolloClient({
  link: from([setAuthorizationLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPosts: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
