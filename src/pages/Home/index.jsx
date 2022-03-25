import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { clearCurrentMemoryJar } from '../../redux/MemoryJar/memoryJarActions';
import { setCurrentPath } from '../../redux/Path/pathActions';

// components
import Memory from '../../components/Memory';
import MemoryJarPreview from '../../components/MemoryJarPreview';

// services
import * as memoryJarService from '../../services/memoryJarService';

import './styles.scss'

const totalRecentMemories = 10;

const Home = (props) => {
    const { currentUser, currentMemoryJar, clearCurrentMemoryJar, setCurrentPath } = props;
    const [memoryJars, setMemoryJars] = useState([]);
    const [recentMemories, setRecentMemories] = useState([]);
    const [favoriteMemories, setFavoriteMemories] = useState([]);

    useEffect(() => {
        const getMemories = async () => {
            const ownerJars = await memoryJarService.getJarsByViewer(currentUser?.id);
            let newestMemories = [];
            let favoritedMemories = [];
            for (const jar of ownerJars.data) {
                if (jar.memories?.length) {
                    let mappedMemories = memoryJarService.mapMemories(jar.jarId, jar.memories);
                    // Clone mappedMemories instead of shallow copy so all memories are iterated through
                    const totalMemories = mappedMemories.map(memory => memory);
                    totalMemories.forEach(memory => {
                        if (memory.isFavorited) {
                            const memoryIndex = mappedMemories.indexOf(memory);
                            favoritedMemories.push(mappedMemories.splice(memoryIndex, 1)[0]);
                        };
                    });
                    const updatedMemories = newestMemories.concat(mappedMemories);
                    newestMemories = updatedMemories;
                };
            };
            newestMemories.sort((a, b) => {
                return b.timestamp - a.timestamp
            });
            setRecentMemories(newestMemories.slice(0, totalRecentMemories));
            setFavoriteMemories(favoritedMemories);
            setMemoryJars(ownerJars.data);
        };

        getMemories();
        if (currentMemoryJar) {
            clearCurrentMemoryJar();
        };
        // eslint-disable-next-line
    }, [currentUser?.id]);

    useEffect(() => {
        setCurrentPath('Home');
    }, [])

    return (
        <div className='home-wrapper'>
            <h2>Favorite Memories</h2>
            <Memory showFavoritesOnly={true} favoriteMemories={favoriteMemories} />
            <h2>Recent Memories</h2>
            <Memory recentMemories={recentMemories} />
            <div className='memory-jar-previews'>
                {memoryJars?.map(jar => <MemoryJarPreview key={jar.jarId} jar={jar} />)}
            </div>
        </div>
    );
};

Home.defaultProps = {
    currentUser: null,
    currentMemoryJar: null,
    currentPath: null
};

const mapStateToProps = ({ user, memoryJar, path }) => ({
    currentUser: user.currentUser,
    currentMemoryJar: memoryJar.currentMemoryJar,
    currentPath: path.currentPath
});

const mapDispatchToProps = dispatch => ({
    clearCurrentMemoryJar: memoryJar => dispatch(clearCurrentMemoryJar(memoryJar)),
    setCurrentPath: path => dispatch(setCurrentPath(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);