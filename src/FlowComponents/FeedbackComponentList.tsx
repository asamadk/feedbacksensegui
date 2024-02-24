import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Joyride from 'react-joyride';
import DynamicComponentIcon from './DynamicComponentIcon'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { STATUS } from 'react-joyride';
import { CallBackProps } from 'react-joyride';
import { Step } from 'react-joyride';
import { colorPalette, componentList, joyrideConstants } from '../Utils/Constants';
import { useSelector } from 'react-redux';
import { joyrideState } from '../Utils/types';

const getCommonContainerStyle = () => {
    return {
        margin: '10px',
        borderRadius: '5px',
        textAlign: 'start',
        padding: '10px',
        height: '100px',
        display: 'flex',
        overflowY: 'hidden',
        cursor: 'pointer',
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
        border: `1px ${colorPalette.textSecondary} solid`
    }
}

const commonLogoStyle = {
    // marginTop: '20px',
    marginRight: '10px',
    height: 'fit-content'
}




function FeedbackComponentList() {

    const onDragStart = (event: any, nodeType: any) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(nodeType));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Box sx={{ backgroundColor: colorPalette.textSecondary, paddingTop: '10px', paddingBottom: '10px' }}>
            {
                componentList.map(component => {
                    return (
                        <div
                            key={component.id}
                            className={component.header.split(' ')[0]}
                        >
                            {component.isAvailable === true &&
                                <Box
                                    onDragStart={(e) => onDragStart(e, component)}
                                    key={component.id}
                                    draggable={true}
                                    sx={{ ...getCommonContainerStyle(), backgroundColor: colorPalette.background }}
                                >
                                    <Box sx={commonLogoStyle} >
                                        <DynamicComponentIcon id={component.id} />
                                    </Box>
                                    <Box >
                                        <Typography color={component.bgColor} fontSize={15} >{component.header}</Typography>
                                        <Typography marginTop={'20px'} color={colorPalette.textPrimary} fontSize={12} >
                                            {component.description.substring(0, 120)}
                                            {component.description.length > 120 ? '...' : ''}
                                        </Typography>
                                    </Box>
                                    <Box color={component.bgColor}>
                                        <DragIndicatorIcon />
                                    </Box>
                                </Box>
                            }
                        </div>
                    )
                })
            }
        </Box>
    )
}

export default FeedbackComponentList