import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearCurrentMemoryJar } from '../../../redux/MemoryJar/memoryJarActions';

// components
import IconButton from '../IconButton';
import { AppBar, Toolbar, SvgIcon } from '@mui/material';

// assets
import LogoutIcon from '@mui/icons-material/Logout';

import './styles.scss'

const MainMenuIconSvg = (props) => {
    return (
        <SvgIcon {...props}>
            <path id="Jar Bottom" d="m42.6 209.4q14.1 8.7 38.6 13.2q24.4 4.5 52.6 4.5q28.1 0 52.6-4.5q24.4-4.5 38.6-13.2v17.7q0 7.1-12.3 13.3q-12.2 6.1-33.2 9.7q-21 3.6-45.7 3.6q-24.7 0-45.7-3.6q-21.1-3.6-33.3-9.7q-12.2-6.2-12.2-13.3v-17.7zm0-39.9v17.7q0 7.1 12.2 13.3q12.2 6.1 33.3 9.7q21 3.6 45.7 3.6q24.7 0 45.7-3.6q21-3.6 33.2-9.7q12.3-6.2 12.3-13.3v-17.7q-14.2 8.7-38.6 13.2q-24.5 4.5-52.6 4.5q-28.2 0-52.6-4.5q-24.5-4.5-38.6-13.2z" />
            <path id="Jar Middle" d="m42.6 131.4q14.1 8.7 38.6 13.2q24.4 4.5 52.6 4.5q28.1 0 52.6-4.5q24.4-4.5 38.6-13.2v17.7q0 7.1-12.3 13.3q-12.2 6.1-33.2 9.7q-21 3.6-45.7 3.6q-24.7 0-45.7-3.6q-21.1-3.6-33.3-9.7q-12.2-6.2-12.2-13.3v-17.7zm0-39.9v17.7q0 7.1 12.2 13.3q12.2 6.1 33.3 9.7q21 3.6 45.7 3.6q24.7 0 45.7-3.6q21-3.6 33.2-9.7q12.3-6.2 12.3-13.3v-17.7q-14.2 8.7-38.6 13.2q-24.5 4.5-52.6 4.5q-28.2 0-52.6-4.5q-24.5-4.5-38.6-13.2z" />
            <path id="Jar Top" d="m143.9 78.3c16-1.9 23.4-2.8 37.6-6.3c14.3-3.6 26.4-6.7 35-12v16q0 6.5-11.1 12.1q-11.1 5.5-30.2 8.8q-19 3.2-41.4 3.2q-22.4 0-41.5-3.2c-12.7-2.2-22.2-5.5-22.2-5.5c0 0 61.4-3.7 73.8-13.1z" />
            <path id="Lid" d="m126.1 175.4m-29-20.4m44.8-13.4m-66.7-17.7m-36.9-72.8q-8.6 8.5-4.6 14.1l7.3 10.4q3.9 5.5 19.3 6.6q15.3 1 37.8-2.7q22.5-3.7 46.6-11.3q24.1-7.6 42.7-16.8q18.5-9.3 27.1-17.8q8.6-8.6 4.6-14.1l-7.3-10.4q-3.9-5.6-19.3-6.6q-15.3-1-37.8 2.7q-22.5 3.6-46.6 11.2q-24.1 7.6-42.7 16.9q-18.5 9.2-27.1 17.8z" />
        </SvgIcon>
    );
};

const NewJarIconSvg = (props) => {
    return (
        <SvgIcon {...props}>
            <path id="Jar Bottom" d="m42.6 209.4q14.1 8.7 38.6 13.2 24.4 4.5 52.6 4.5c18.7 0 36.9 12.2 53.2 9.2 16.4-3 17.4-2.6 26.8-8.4l11.2-0.8q0 7.1-12.3 13.3-12.2 6.1-33.2 9.7-21 3.6-45.7 3.6-24.7 0-45.7-3.6-21.1-3.6-33.3-9.7-12.2-6.2-12.2-13.3v-17.7zm0-39.9v17.7q0 7.1 12.2 13.3 12.2 6.1 33.3 9.7 21 3.6 45.7 3.6c16.4 0 15-0.4 18.1-3.3 1.9-1.6 1.8-3.4 1.3-6.1-0.5-2.5 0.1-1.3-1-6.2l-0.7-3.7c-0.8-3.2-1.1-7-3.7-7.2-16.5-1.5 4.7-0.1-14-0.1q-28.2 0-52.6-4.5-24.5-4.5-38.6-13.2z" />
            <path id="Jar Middle" d="m42.6 131.4q14.1 8.7 38.6 13.2 24.4 4.5 52.6 4.5 28.1 0 52.6-4.5 24.4-4.5 38.6-13.2l-0.1 13.6c0 4.8-8.8 6.6-13.6 6.5-5.1-0.1-17.9 0.2-31.9 2.6-14 2.4-29.2 21.6-45.6 21.6q-24.7 0-45.7-3.6-21.1-3.6-33.3-9.7-12.2-6.2-12.2-13.3v-17.7zm0-39.9v17.7q0 7.1 12.2 13.3 12.2 6.1 33.3 9.7 21 3.6 45.7 3.6 24.7 0 45.7-3.6 21-3.6 33.2-9.7 12.3-6.2 12.3-13.3v-17.7q-14.2 8.7-38.6 13.2-24.5 4.5-52.6 4.5-28.2 0-52.6-4.5-24.5-4.5-38.6-13.2z" />
            <path id="Jar Top" d="m143.9 78.3c16-1.9 23.4-2.8 37.6-6.3 14.3-3.6 26.4-6.7 35-12v16q0 6.5-11.1 12.1-11.1 5.5-30.2 8.8-19 3.2-41.4 3.2-22.4 0-41.5-3.2c-12.7-2.2-22.2-5.5-22.2-5.5 0 0 61.4-3.7 73.8-13.1z" />
            <path id="Lid" d="m65.4 33.3q18.6-9.3 42.7-16.9 24.1-7.6 46.6-11.2 22.5-3.7 37.8-2.7 15.4 1 19.3 6.6l7.3 10.4q4 5.5-4.6 14.1-8.6 8.5-27.1 17.8-18.6 9.2-42.7 16.8-24.1 7.6-46.6 11.3-22.5 3.7-37.8 2.7-15.4-1.1-19.3-6.6l-7.3-10.4q-4-5.6 4.6-14.1 8.6-8.6 27.1-17.8z" />
            <path id="Add Button" d="m224.8 198.7q-1.6 1.6-3.8 1.6h-21.3v21.1q0 2.1-1.6 3.7-1.6 1.6-3.8 1.6h-10.6q-2.2 0-3.8-1.6-1.6-1.6-1.6-3.7v-21.1h-21.3q-2.2 0-3.8-1.6-1.5-1.5-1.5-3.7v-10.5q0-2.1 1.5-3.7 1.6-1.6 3.8-1.6h21.3v-21.1q0-2.1 1.6-3.7 1.6-1.5 3.8-1.5h10.6q2.2 0 3.8 1.5 1.6 1.6 1.6 3.7v21.1h21.3q2.2 0 3.7 1.6 1.6 1.6 1.6 3.7v10.5q0 2.2-1.6 3.7zm-3.6-63.7q-14.7-8.5-32.1-8.5-17.4 0-32.1 8.5-14.7 8.5-23.3 23-8.6 14.6-8.6 31.8 0 17.2 8.6 31.7 8.6 14.5 23.3 23 14.7 8.5 32.1 8.5 17.4 0 32.1-8.5 14.7-8.5 23.3-23 8.6-14.5 8.6-31.7 0-17.2-8.6-31.8-8.6-14.5-23.3-23z" />
        </SvgIcon>
    );
};

const NavBar = (props) => {
    const { handleLogout, clearCurrentMemoryJar, currentPath } = props;
    const navigate = useNavigate();

    const handleCreateNewMemoryJar = () => {
        clearCurrentMemoryJar();
        navigate('/jars/new');
    }

    const configMainMenuIconButton = {
        icon: <MainMenuIconSvg id='main-menu-icon' viewBox='0 0 256 256' />,
        isPressed: currentPath === 'Home',
        handleClick: () => navigate('/home')
    };

    const configNewMemoryJarIconButton = {
        icon: <NewJarIconSvg id='new-jar-icon' viewBox='0 0 256 256' />,
        isPressed: currentPath === 'Jars/New',
        handleClick: handleCreateNewMemoryJar
    };

    const configLogOutIconButton = {
        icon: <LogoutIcon id='logout-icon' />,
        handleClick: handleLogout
    };

    return (
        <div className='app-bar-wrapper'>
            <AppBar position="fixed" color='action' >
                <Toolbar>
                    <div className='main-menu-button'>
                        <IconButton {...configMainMenuIconButton}/>
                    </div>
                    <div className='user-nav-buttons'>
                        <IconButton {...configNewMemoryJarIconButton}/>
                        <IconButton {...configLogOutIconButton}/>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

const mapStateToProps = ({ memoryJar, path }) => ({
    currentMemoryJar: memoryJar.currentMemoryJar,
    currentPath: path.currentPath
});

const mapDispatchToProps = dispatch => ({
    clearCurrentMemoryJar: memoryJar => dispatch(clearCurrentMemoryJar(memoryJar))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);