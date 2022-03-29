import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { clearCurrentMemoryJar } from '../../redux/MemoryJar/memoryJarActions';
import { setCurrentPath } from '../../redux/Path/pathActions';

// components
import Memory from '../../components/Memory';
import MemoryJarPreview from '../../components/MemoryJarPreview';

// services
import * as memoryJarService from '../../services/memoryJarService';

// hooks
import useInterval from '../../hooks/useInterval';

import './styles.scss'

const totalRecentMemories = 10;
const circuitBreakerTripCount = 5;

const Home = (props) => {
    const { currentUser, currentMemoryJar, clearCurrentMemoryJar, setCurrentPath } = props;
    const [memoryJars, setMemoryJars] = useState([]);
    const [recentMemories, setRecentMemories] = useState([]);
    const [favoriteMemories, setFavoriteMemories] = useState([]);
    const [circuitBreakerCount, setCircuitBreakerCount] = useState(0);

    const getMemories = async () => {
        const usersJars = await memoryJarService.getJarsByViewer(currentUser?.id);
        if (usersJars?.data.length) {
            let newestMemories = [];
            let favoritedMemories = [];
            for (const jar of usersJars.data) {
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
            setMemoryJars(usersJars.data);
        } else {
            if (usersJars?.data.length === 0) {
                console.log('0 Jars for User');
                const defaultJar = await memoryJarService.getJar('e54ff87b-639c-4488-9eac-f13295c8703b');
                const defaultMemories = memoryJarService.mapMemories(defaultJar.data.jarId, defaultJar.data.memories);
                setRecentMemories(defaultMemories);
                setMemoryJars([defaultJar.data]);
            } else {
                console.log('No User Jar Data found');
                if (circuitBreakerCount + 1 === circuitBreakerTripCount) {
                    setRecentMemories([]);
                } else {
                    const loadingMemory = {
                        image: {
                            src: null,
                            alt: 'loading image',
                            key: 'loading-image'
                        },
                        isFavorited: false,
                        timestamp: 0
                    };
                    setRecentMemories([loadingMemory]);
                };
            };
        };
    };

    useEffect(() => {
        setCurrentPath('Home');
        getMemories();
        if (currentMemoryJar) {
            clearCurrentMemoryJar();
        };
        // eslint-disable-next-line
    }, []);

    useInterval(() => {
        getMemories();
        console.warn(`Attempt Count: ${circuitBreakerCount + 1}, Circuit Breaker Trip Count: ${circuitBreakerTripCount}`);
        setCircuitBreakerCount(circuitBreakerCount + 1);
    }, 10000, memoryJars.length === 0 && circuitBreakerCount < circuitBreakerTripCount);

    return (
        <div className='home-wrapper'>
            {favoriteMemories?.length > 0 && 
                <>
                    <h2>Favorite Memories</h2>
                    <Memory showFavoritesOnly={true} favoriteMemories={favoriteMemories} />
                </>
            }
            <h2>Recent Memories</h2>
            <Memory recentMemories={recentMemories} />
            {(circuitBreakerCount >= circuitBreakerTripCount) && 
                <h4 className='error-message'>The server isn't working right now, try again later</h4>
            }
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