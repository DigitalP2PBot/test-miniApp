import React from "react";

type  Props = {
    label?: string
    content?: string
}

const InfoLabel: React.FC<Props> = ({label, content}) => {
    return (
        <p className="text-customGrayText mt-0 mr-0 mb-4 ml-0 text-left">
            <h4>{label} </h4>
            <span className="text-dimGray">{content}</span>
        </p>
    )
}

export default InfoLabel;
