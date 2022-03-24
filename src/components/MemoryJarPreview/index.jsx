import React from 'react';
import { Link } from 'react-router-dom';

// assets
import MemoryJarIcon from '../../assets/memoryjar_icon.svg'
import MemoryImageFrame from '../MemoryImageFrame';

// services
import * as memoryJarService from '../../services/memoryJarService';

import './styles.scss'

const MemoryJarPreview = ({ jar }) => {
    const memoryPreviews = memoryJarService.mapMemories(jar.jarId, jar.memories);
    console.log('Mapped Memories: ', memoryPreviews);
    return (
        <div className='memory-jar-preview-wrapper'>
            <Link to={`/jars/${jar.jarId}`}>
                <img className='preview-icon' src={MemoryJarIcon} alt="Memory Jar Preview" />
                <MemoryImageFrame memory={memoryPreviews[0]} />
            </Link>
        </div>
    );
};

export default MemoryJarPreview;