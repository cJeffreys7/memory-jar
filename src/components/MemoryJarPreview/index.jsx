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

    return (
        <div className='memory-jar-preview-wrapper'>
            <Link to={`/jars/${jar.jarId}`}>
                <img className='preview-icon' src={MemoryJarIcon} alt="Memory Jar Preview" />
                <div className='preview-images'>
                    <div id='preview-image-1' className='preview-image'>
                        <MemoryImageFrame memory={memoryPreviews[0]} />
                    </div>
                    <div id='preview-image-2' className='preview-image'>
                        <MemoryImageFrame memory={memoryPreviews[1]} />
                    </div>
                    <div id='preview-image-3' className='preview-image'>
                        <MemoryImageFrame memory={memoryPreviews[2]} />
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MemoryJarPreview;