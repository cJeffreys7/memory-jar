import React from 'react';

// components
import MemoryImage from '../MemoryImage';

import './styles.scss'

const MemoryImageFrame = ({ memory }) => {
    return (
        <div className='frame-wrapper'>
            <div id='frame-top'/>
            <div id='frame-right'/>
            <div id='frame-bottom'/>
            <div id='frame-left'/>
            <div className='image-element'>
                <MemoryImage
                    src={memory?.image.src}
                    alt={memory?.image.alt}
                    key={memory?.image.key}
                />
            </div>
        </div>
    );
};

export default MemoryImageFrame;