import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setCurrentMemoryJar } from '../../redux/MemoryJar/memoryJarActions';
import { setCurrentPath } from '../../redux/Path/pathActions';

// components
import Memory from '../../components/Memory';
import MemoryJarActionBar from '../../components/MemoryJarActionBar';

// services
import * as memoryJarService from '../../services/memoryJarService';

import './styles.scss'
import DialogModal from '../../components/MUI/DialogModal';

const JarDetails = (props) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { currentMemoryJar, setCurrentMemoryJar, setCurrentPath } = props;
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);

    const openDeleteJarModal = () => {
        setDeleteModal(true);
    }

    const closeDeleteJarModal = () => {
        setDeleteModal(false);
    }

    const deleteJar = async () => {
        const result = await memoryJarService.deleteJar(id);
        if (result) navigate('/home');
    }

    useEffect(() => {
        const getMemoryJar = async (jarId) => {
            const newMemoryJar = await memoryJarService.getJar(jarId);
            setCurrentMemoryJar(newMemoryJar.data);
        };

        getMemoryJar(id);
        setLoading(false);
        // eslint-disable-next-line
    }, [id]);

    useEffect(() => {
        setCurrentPath('JarDetails');
        // eslint-disable-next-line
    }, []);

    return (
        <div className='jar-details-wrapper'>
            <h1>{currentMemoryJar?.title}</h1>
            <MemoryJarActionBar jarId={id} deleteJar={openDeleteJarModal} />
            <h2>Favorite {currentMemoryJar?.title} Memories</h2>
            <Memory showFavoritesOnly={true} loading={loading} />
            <h2>{currentMemoryJar?.title} Memories</h2>
            <Memory loading={loading} />
            <DialogModal 
                isOpen={deleteModal}
                title={'Delete Memory Jar'}
                description={'Are you sure you want to throw away this memory jar? Any memories in here will be thrown away as well!'}
                confirmText={'Delete'}
                cancelText={'Cancel'}
                confirmHandleClick={deleteJar}
                cancelHandleClick={closeDeleteJarModal}
            />
        </div>
    );
};

JarDetails.defaultProps = {
    currentMemoryJar: null,
    currentPath: null
};

const mapStateToProps = ({ memoryJar, path }) => ({
    currentMemoryJar: memoryJar.currentMemoryJar,
    currentPath: path.currentPath
});

const mapDispatchToProps = dispatch => ({
    setCurrentMemoryJar: memoryJar => dispatch(setCurrentMemoryJar(memoryJar)),
    setCurrentPath: path => dispatch(setCurrentPath(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(JarDetails);