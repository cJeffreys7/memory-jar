import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearCurrentMemoryJar } from '../../../redux/MemoryJar/memoryJarActions';
import { AppBar, Toolbar, Typography } from '@mui/material';
// import { createSvgIcon } from '@mui/material/utils';

// assets
// import MainMenuIcon from '../../../assets/memoryjar_icon_dark.svg'
import IconButton from '../IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

import './styles.scss'

const NavBar = (props) => {
    const { handleLogout, clearCurrentMemoryJar } = props;
    const navigate = useNavigate();
    // const MainMenuIconSVG = createSvgIcon(
    //     <path d="m42.6 209.4q14.1 8.7 38.6 13.2q24.4 4.5 52.6 4.5q28.1 0 52.6-4.5q24.4-4.5 38.6-13.2v17.7q0 7.1-12.3 13.3q-12.2 6.1-33.2 9.7q-21 3.6-45.7 3.6q-24.7 0-45.7-3.6q-21.1-3.6-33.3-9.7q-12.2-6.2-12.2-13.3v-17.7zm0-39.9v17.7q0 7.1 12.2 13.3q12.2 6.1 33.3 9.7q21 3.6 45.7 3.6q24.7 0 45.7-3.6q21-3.6 33.2-9.7q12.3-6.2 12.3-13.3v-17.7q-14.2 8.7-38.6 13.2q-24.5 4.5-52.6 4.5q-28.2 0-52.6-4.5q-24.5-4.5-38.6-13.2z" />,
	//     <path d="m42.6 131.4q14.1 8.7 38.6 13.2q24.4 4.5 52.6 4.5q28.1 0 52.6-4.5q24.4-4.5 38.6-13.2v17.7q0 7.1-12.3 13.3q-12.2 6.1-33.2 9.7q-21 3.6-45.7 3.6q-24.7 0-45.7-3.6q-21.1-3.6-33.3-9.7q-12.2-6.2-12.2-13.3v-17.7zm0-39.9v17.7q0 7.1 12.2 13.3q12.2 6.1 33.3 9.7q21 3.6 45.7 3.6q24.7 0 45.7-3.6q21-3.6 33.2-9.7q12.3-6.2 12.3-13.3v-17.7q-14.2 8.7-38.6 13.2q-24.5 4.5-52.6 4.5q-28.2 0-52.6-4.5q-24.5-4.5-38.6-13.2z" />,
	//     <path d="m143.9 78.3c16-1.9 23.4-2.8 37.6-6.3c14.3-3.6 26.4-6.7 35-12v16q0 6.5-11.1 12.1q-11.1 5.5-30.2 8.8q-19 3.2-41.4 3.2q-22.4 0-41.5-3.2c-12.7-2.2-22.2-5.5-22.2-5.5c0 0 61.4-3.7 73.8-13.1z" />,
	//     <path d="m126.1 175.4m-29-20.4m44.8-13.4m-66.7-17.7m-36.9-72.8q-8.6 8.5-4.6 14.1l7.3 10.4q3.9 5.5 19.3 6.6q15.3 1 37.8-2.7q22.5-3.7 46.6-11.3q24.1-7.6 42.7-16.8q18.5-9.3 27.1-17.8q8.6-8.6 4.6-14.1l-7.3-10.4q-3.9-5.6-19.3-6.6q-15.3-1-37.8 2.7q-22.5 3.6-46.6 11.2q-24.1 7.6-42.7 16.9q-18.5 9.2-27.1 17.8z" />,
    //     'MainMenu'
    // );

    const handleCreateNewMemoryJar = () => {
        clearCurrentMemoryJar();
        navigate('/jars/new');
    }

    const configMainMenuIconButton = {
        icon: <MenuIcon />,
        handleClick: () => navigate('/home')
    };

    const configNewMemoryJarIconButton = {
        icon: <MenuIcon />,
        handleClick: handleCreateNewMemoryJar
    };

    const configLogOutIconButton = {
        icon: <LogoutIcon />,
        handleClick: handleLogout
    };

    return (
        <div className='app-bar-wrapper'>
            <AppBar position="fixed" color='action' >
                <Toolbar>
                <IconButton {...configMainMenuIconButton}/>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                </Typography>
                <IconButton {...configNewMemoryJarIconButton}/>
                <IconButton {...configLogOutIconButton}/>
                </Toolbar>
            </AppBar>
        </div>
    );
};

const mapStateToProps = ({ memoryJar }) => ({
    currentMemoryJar: memoryJar.currentMemoryJar
});

const mapDispatchToProps = dispatch => ({
    clearCurrentMemoryJar: memoryJar => dispatch(clearCurrentMemoryJar(memoryJar))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);