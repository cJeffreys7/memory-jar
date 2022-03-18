import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setCurrentMemoryJar } from '../../redux/MemoryJar/memoryJarActions';
import { createTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// components
import Slider from 'react-slick';
import IconButton from '../MUI/IconButton';
import DialogModal from '../MUI/DialogModal';

// assets
import FavoriteIcon from '@mui/icons-material/Favorite';
import DefaultImg from '../../assets/memoryjar_logo.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// services
import * as memoryJarService from '../../services/memoryJarService'

import './styles.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MemoryImage from '../MemoryImage';

const theme = createTheme({
    palette: {
        primary: {
            main: '#c43232'
        },
        secondary: {
            main: '#a0a0a0'
        }
    }
})

const Memory = (props) => {
    const navigate = useNavigate();
    const {
        currentUser,
        currentMemoryJar,
        setCurrentMemoryJar,
        showFavoritesOnly,
        recentMemories,
        favoriteMemories,
        loading
    } = props;
    const [slideIndex, setSlideIndex] = useState(0);
    const [memories, setMemories] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteMemoryFile, setDeleteMemoryFile] = useState(null);

    const settings = {
        autoplay: true,
        autoplaySpeed: 5000,
        swipe: true,
        fade: true,
        speed: 1000,
        infinite: true,
        pauseOnHover: true,
        className: 'carousel',
        afterChange: (current) => setSlideIndex(current)
    };

    const editMemory = () => {
        const memoryId = memories[slideIndex].image.key;
        navigate(`/jars/${currentMemoryJar.jarId}/memories/${memoryId}`)
    }

    const openDeleteMemoryModal = () => {
        if (memories[slideIndex]?.image) {
            setDeleteMemoryFile(memories[slideIndex].image);
            setDeleteModal(true);
        }
    }

    const closeDeleteMemoryModal = () => {
        setDeleteMemoryFile(null);
        setDeleteModal(false);
    }

    const deleteMemory = async () => {
        const result = await memoryJarService.deleteMemory(currentMemoryJar.jarId, deleteMemoryFile.key);
        setCurrentMemoryJar(result.data);
        closeDeleteMemoryModal();
    }

    const favoriteMemory = async () => {
        if (memories.length) {
            const result = await memoryJarService.favoriteMemory(
                    currentMemoryJar,
                    currentMemoryJar.memories[slideIndex].filename,
                    !currentMemoryJar.memories[slideIndex].isFavorited
                );
            if (result) {
                setCurrentMemoryJar(result.data);
            };
        };
    };

    useEffect(() => {
        setMemories([]);
        const formatMemories = () => {
            if (!loading && currentMemoryJar?.memories) {
                const filteredMemories = showFavoritesOnly ? 
                    currentMemoryJar.memories.filter(memory => memory.isFavorited)
                    : currentMemoryJar.memories;
                const mappedMemories = memoryJarService.mapMemories(currentMemoryJar.jarId, filteredMemories);
                setMemories(mappedMemories);
            };
        };

        if (recentMemories) {
            setMemories(recentMemories);
        } else if (favoriteMemories) {
            setMemories(favoriteMemories);
        } else {
            formatMemories();
        };
    }, [currentMemoryJar, recentMemories, favoriteMemories, loading, showFavoritesOnly]);

    const configEditButton = {
        theme: theme,
        icon: <EditIcon />,
        handleClick: editMemory
    }

    const configDeleteButton = {
        theme: theme,
        icon: <DeleteIcon />,
        handleClick: openDeleteMemoryModal
    }

    const configIconButton = {
        theme: theme,
        icon: <FavoriteIcon />,
        handleClick: favoriteMemory
    }

    return (
        <div className='memory-wrapper'>
            <div className='border'>
                <div className='image'>
                    <Slider {...settings}>
                        {memories.length ?
                            memories.map(
                                memory => <MemoryImage src={memory.image.src} alt={memory.image.alt} key={memory.image.key} />
                                )
                            : <img src={DefaultImg} alt='Memory Jar Logo'/>
                        }
                    </Slider>
                </div>
                {!(recentMemories?.length || favoriteMemories?.length) && 
                    <div className='action-button-wrapper'>
                        <div className='admin-buttons'>
                            {currentMemoryJar?.admins?.includes(currentUser?.id) &&
                                <div>
                                    <IconButton {...configEditButton}/>
                                    <IconButton {...configDeleteButton}/>
                                </div>
                            }
                        </div>
                        <div className='favorite-button'>
                            <IconButton
                                {...configIconButton}
                                isPressed={memories ? 
                                            memories[slideIndex]?.isFavorited
                                            : false}
                            />
                        </div>
                    </div>
                }
            </div>
            <DialogModal 
                isOpen={deleteModal}
                title={'Delete Memory'}
                description={`Are you sure you want to throw away this memory of ${deleteMemoryFile?.alt}?`}
                confirmText={'Delete'}
                cancelText={'Cancel'}
                confirmHandleClick={deleteMemory}
                cancelHandleClick={closeDeleteMemoryModal}
            />
        </div>
    );
};

const mapStateToProps = ({ user, memoryJar }) => ({
    currentUser: user.currentUser,
    currentMemoryJar: memoryJar.currentMemoryJar
});

const mapDispatchToProps = dispatch => ({
    setCurrentMemoryJar: memoryJar => dispatch(setCurrentMemoryJar(memoryJar))
});

export default connect(mapStateToProps, mapDispatchToProps)(Memory);