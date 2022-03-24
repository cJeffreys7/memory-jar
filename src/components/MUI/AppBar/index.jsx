import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearCurrentMemoryJar } from '../../../redux/MemoryJar/memoryJarActions';
import { AppBar, Toolbar, Typography } from '@mui/material';

// assets
import MainMenuIcon from '../../../assets/memoryjar_icon.svg'
import AddJarIcon from '../../../assets/memoryjar_add_icon.svg'
import IconButton from '../IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

import './styles.scss'

const NavBar = (props) => {
    const { handleLogout, clearCurrentMemoryJar } = props;
    const navigate = useNavigate();

    const handleCreateNewMemoryJar = () => {
        clearCurrentMemoryJar();
        navigate('/jars/new');
    }

    const configMainMenuIconButton = {
        icon: 
            <img
                src={MainMenuIcon}
                alt="Main Menu"
                style={{ width: '48px' }}
            />,
        handleClick: () => navigate('/home')
    };

    const configNewMemoryJarIconButton = {
        icon: 
            <img
                src={AddJarIcon}
                alt="Add Jar"
                style={{ width: '48px' }}
            />,
        handleClick: handleCreateNewMemoryJar
    };

    const configLogOutIconButton = {
        icon: <LogoutIcon className='logout-icon' />,
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

const mapStateToProps = ({ memoryJar }) => ({
    currentMemoryJar: memoryJar.currentMemoryJar
});

const mapDispatchToProps = dispatch => ({
    clearCurrentMemoryJar: memoryJar => dispatch(clearCurrentMemoryJar(memoryJar))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);