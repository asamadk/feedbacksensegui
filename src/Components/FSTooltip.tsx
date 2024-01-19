import React, { useEffect } from 'react'

const FSTooltip = ({ active, payload, label,percent } : any) => {
    
    useEffect(() => {
        console.log("🚀 ~ file: FSTooltip.tsx:4 ~ FSTooltip ~ payload:", payload)
    },[]);

    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: '10px',
                borderRadius: '5px',
                color: 'white'
            }}>
                <p>{`${label}`}</p>
                <p>{`Response: ${payload[0].value}${percent === true ? '%' : ''}`}</p>
            </div>
        );
    }

    return null;
};

export default FSTooltip