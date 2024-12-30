import React from 'react';
import pngLogo from '../../assets/squared_logo.png';

const LayoutHeader: React.FC<object> = () => {
    return (
        <header className="h-20v p-8">
            <img src={pngLogo} alt="logo" className="h-full m-auto"/>
        </header>
    );
};

export default LayoutHeader;
