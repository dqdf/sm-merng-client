import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import NoAuthOnly from './util/NoAuthOnly';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuBar from './components/MenuBar';
import SinglePost from './pages/SinglePost';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Container>
          <MenuBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='login' element={<NoAuthOnly><Login /></NoAuthOnly>} />
            <Route path='register' element={<NoAuthOnly><Register /></NoAuthOnly>} />
            <Route path='/posts/:postId' element={<SinglePost />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
