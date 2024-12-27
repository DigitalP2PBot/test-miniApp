import React from 'react';
import svgLogo from '../../assets/LOGO CLARO.svg';

const LayoutHeader: React.FC<object> = () => {
    return (
        <header className="h-25v">
            <img src={svgLogo} alt="logo" className="h-full m-auto"/>
        </header>
    );
};

export default LayoutHeader;
