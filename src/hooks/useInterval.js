import { useRef, useEffect } from 'react';

const useInterval = (callback, delay, condition) => {
        const savedCallback = useRef();

        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        useEffect(() => {
            function tick() {
                savedCallback.current();
                console.log('Performing interval function');
            }
            if (condition) {
                let interval = setInterval(tick, delay);
                return () => clearInterval(interval);
            };
        });
};

export default useInterval;