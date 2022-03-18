import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';

const MemoryImage = ({ src, alt }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <div className='memory-image-wrapper'>
            <img
                style={imageLoaded ? {} : { display: 'none' }}
                src={src}
                alt={alt}
                onLoad={() => {
                    setImageLoaded(true);
                }}
            />
            {!imageLoaded && 
                <div className='skeleton-wrapper'>
                    <Skeleton variant='rectangular' animation='wave' width={1024} height={1024} />
                </div>
            }
        </div>
    );
};

export default MemoryImage;