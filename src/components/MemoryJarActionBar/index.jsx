import React from 'react';
import { connect } from 'react-redux';
import { clearCurrentMemoryJar } from '../../redux/MemoryJar/memoryJarActions';
import { useNavigate } from 'react-router-dom';

// components
import IconButton from '../MUI/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

import Style from './styles.scss'

const MemoryJarActionBar = (props) => {
    const { currentUser, currentMemoryJar, clearCurrentMemoryJar, jarId, deleteJar } = props;
    const navigate = useNavigate();
    const iconSize = Style.fontSize;

    const configEditIconButton = {
        icon: <EditIcon sx={{ fontSize: iconSize}}/>
    };

    const configShareIconButton = {
        icon: <ShareIcon sx={{ fontSize: iconSize}}/>
    };

    const configAddIconButton = {
        icon: <AddIcon sx={{ fontSize: iconSize}}/>
    };

    const configDeleteIconButton = {
        icon: <DeleteIcon sx={{ fontSize: iconSize}}/>
    };

    const editMemoryJar = e => {
        navigate(`/jars/${jarId}/edit`);
    };

    const shareMemoryJar = e => {
        console.log('Share Memory Jar action pressed');
    };

    const addMemoryJar = e => {
        clearCurrentMemoryJar();
        navigate(`/jars/${jarId}/memories/new`);
    };

    const deleteMemoryJar = e => {
        deleteJar();
    };

    const adminActions = currentMemoryJar?.admins?.includes(currentUser?.id);
    const ownerActions = currentMemoryJar?.owner === currentUser?.id;

    return (
        <div className='action-bar'>
            {ownerActions &&
                <IconButton {...configEditIconButton} handleClick={editMemoryJar}/>
            }
            {adminActions && 
                <IconButton {...configShareIconButton} handleClick={shareMemoryJar}/>
            }
            {adminActions && 
                <IconButton {...configAddIconButton} handleClick={addMemoryJar}/>
            }
            {ownerActions &&
                <IconButton {...configDeleteIconButton} handleClick={deleteMemoryJar}/>
            }
        </div>
    );
};

const mapStateToProps = ({ user, memoryJar }) => ({
    currentUser: user.currentUser,
    currentMemoryJar: memoryJar.currentMemoryJar
});

const mapDispatchToProps = dispatch => ({
    clearCurrentMemoryJar: memoryJar => dispatch(clearCurrentMemoryJar(memoryJar))
});

export default connect(mapStateToProps, mapDispatchToProps)(MemoryJarActionBar);