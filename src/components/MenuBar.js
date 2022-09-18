import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { AuthContext } from '../context/auth';

function MenuBar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' : pathname.substring(1);

    const [activeItem, setActiveItem] = useState(path);

    const handleItemClick = (e, { name }) => setActiveItem(name);

    return user ? (<Menu pointing secondary color="teal">
        <Menu.Item
            name={user.username}
            active
            as={Link}
            to='/'
        />
        <Menu.Menu position='right'>
            <Menu.Item
                name='logout'
                onClick={() => {
                    logout();
                    navigate('login');
                    setActiveItem('login');
                }}
            />
        </Menu.Menu>
    </Menu>) : (
        <Menu pointing secondary color="teal">
            <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
                as={Link}
                to='/'
            />
            <Menu.Menu position='right'>
                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    onClick={handleItemClick}
                    as={Link}
                    to='login'
                />
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                    as={Link}
                    to='register'
                />
            </Menu.Menu>
        </Menu>
    );
}

export default MenuBar;
