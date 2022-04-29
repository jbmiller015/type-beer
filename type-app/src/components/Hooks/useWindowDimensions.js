import {useState, useEffect} from 'react';

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());


    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        localStorage.setItem('mobileView', navigator.userAgentData.mobile);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
