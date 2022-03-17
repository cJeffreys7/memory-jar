import React from 'react';
import { Link } from 'react-router-dom';

// assets
import MemoryJarIcon from '../../assets/memoryjar_icon.svg'

import './styles.scss'

const MemoryJarPreview = ({ jarId }) => {
    return (
        <div className='memory-jar-preview-wrapper'>
            <Link to={`/jars/${jarId}`}>
                <img className='preview-icon' src={MemoryJarIcon} alt="Memory Jar Preview" />
            </Link>
        </div>
    );
};

export default MemoryJarPreview;