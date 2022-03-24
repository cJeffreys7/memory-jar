import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';

import './styles.scss';

const MemoryImage = ({ src, alt }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <div className='memory-image-wrapper'>
            <img
                className='aspect-ratio-img'
                style={imageLoaded ? {} : { display: 'none' }}
                src={src}
                alt={alt}
                onLoad={() => {
                    setImageLoaded(true);
                }}
            />
            <img
                className='blurred-img'
                style={imageLoaded ? {} : { display: 'none' }}
                src={src}
                alt={alt}
                onLoad={() => {
                    setImageLoaded(true);
                }}
            />
            {!imageLoaded && 
                <div className='skeleton-wrapper'>
                    <Skeleton variant='rectangular' />
                </div>
            }
        </div>
    );
};

export default MemoryImage;