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
        border : `1px ${colorPalette.textSecondary} solid`
    }
}

const commonLogoStyle = {
    // marginTop: '20px',
    marginRight: '10px',
    height : 'fit-content'
}




function FeedbackComponentList() {

    const [showJoyride, setShowJoyride] = useState(false);

    const [{ run, steps,stepIndex }, setState] = useState<joyrideState>({
        run: false,
        stepIndex : 0,
        steps: [
            {
                content: <h2>
                    Welcome,
                    Let's start by creating a survey!</h2>,
                locale: { skip: <strong aria-label="skip">SKIP</strong> },
                placement: 'center',
                target: 'body',
            },
            {
                content: <h2>Drag this "Welcome Message" component and drop in the canvas</h2>,
                floaterProps: {
                    disableAnimation: true,
                },
                placement: 'bottom',
                spotlightClicks: true,
                spotlightPadding: 20,
                target: '.Welcome',
            },
            {
                content: <h2>Now Drag this component and drop in the canvas</h2>,
                floaterProps: {
                    disableAnimation: true,
                },
                placement: 'bottom',
                spotlightClicks: true,
                spotlightPadding: 20,
                target: '.Single',
            },
            {
                content: <h2>Now connect both components with each other!</h2>,
                locale: { skip: <strong aria-label="skip">SKIP</strong> },
                placement: 'center',
                target: 'body',
            }
        ],
    });

    useEffect(() => {
        const hasSeenJoyride = localStorage.getItem(joyrideConstants.JOYRIDE_7);
        if (!hasSeenJoyride) {
            handleClickStart();
            setShowJoyride(true);
            localStorage.setItem(joyrideConstants.JOYRIDE_7, 'true');
        }
    }, []);

    const handleClickStart = () => {
        setState({
            run: true,
            steps: steps,
            stepIndex : 0
        });
    };

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type,index } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setState({ run: false, steps: steps, stepIndex :  index+1});
        }
    };

    const onDragStart = (event: any, nodeType: any) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(nodeType));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Box sx={{ backgroundColor: colorPalette.textSecondary,paddingTop : '10px',paddingBottom : '10px' }}>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                hideCloseButton
                run={run}
                scrollToFirstStep
                showProgress
                showSkipButton
                steps={steps}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                    buttonNext: {
                        backgroundColor: colorPalette.primary
                    },
                    buttonBack: {
                        color: colorPalette.primary
                    }
                }}
            />
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