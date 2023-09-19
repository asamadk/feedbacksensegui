import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Joyride from 'react-joyride';
import DynamicComponentIcon from './DynamicComponentIcon'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { STATUS } from 'react-joyride';
import { CallBackProps } from 'react-joyride';
import { Step } from 'react-joyride';
import { componentList } from '../Utils/Constants';

const getCommonContainerStyle = () => {
    return {
        backgroundColor: '#1E1E1E',
        border: '1px #454545 solid',
        margin: '10px',
        borderRadius: '5px',
        textAlign: 'start',
        padding: '10px',
        height: '60px',
        display: 'flex',
        overflowY: 'hidden',
        cursor: 'pointer'
    }
}

const commonLogoStyle = {
    marginTop: '20px',
    marginRight: '10px'
}




function FeedbackComponentList() {

    interface State {
        run: boolean;
        steps: Step[];
    }

    const [showJoyride, setShowJoyride] = useState(false);
    const [{ run, steps }, setState] = useState<State>({
        run: false,
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
                content: <h2>Drag this component and drop in the canvas</h2>,
                floaterProps: {
                    disableAnimation: true,
                },
                spotlightPadding: 20,
                target: '.Welcome',
            },
            {
                content: <h2>Now Drag this component and drop in the canvas</h2>,
                floaterProps: {
                    disableAnimation: true,
                },
                spotlightPadding: 20,
                target: '.Single',
            },
            {
                content: <h2>After that connect both components with each other!</h2>,
                locale: { skip: <strong aria-label="skip">SKIP</strong> },
                placement: 'center',
                target: 'body',
            },
            {
                content: <h2>
                    Or <a
                        href='https://www.veed.io/embed/ebd4dcec-5541-4d2b-bea7-5208ca2b44b9'
                        target='__blank'
                    > click here</a> to watch a demo video!</h2>,
                locale: { skip: <strong aria-label="skip">Cancel</strong> },
                placement: 'center',
                target: 'body',
            },
        ],
    });

    useEffect(() => {
        const hasSeenJoyride = localStorage.getItem('hasSeenJoyride');
        if (!hasSeenJoyride) {
            handleClickStart();
            setShowJoyride(true);
            localStorage.setItem('hasSeenJoyride', 'true');
        }
        // localStorage.removeItem('hasSeenJoyride')
    }, []);

    const handleClickStart = () => {
        setState({
            run: true,
            steps: steps
        });
    };

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setState({ run: false, steps: steps });
        }
    };

    const onDragStart = (event: any, nodeType: any) => {
        event.dataTransfer.setData('text/plain', JSON.stringify(nodeType));
        event.dataTransfer.effectAllowed = 'move';
    };

    const onHoverStart = (event: any) => {
        event.currentTarget.style.border = '1px #f1f1f1 solid';
    }

    const onHoverEnd = (event: any) => {
        event.currentTarget.style.border = '1px #454545 solid';
    }

    return (
        <Box height={'calc(100vh - 128px)'} sx={{ backgroundColor: '#1A1A1A' }}>
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
                        backgroundColor: '#006dff'
                    },
                    buttonBack: {
                        color: '#006dff'
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
                            {   component.isAvailable === true &&
                                <Box
                                    onMouseEnter={onHoverStart}
                                    onMouseLeave={onHoverEnd}
                                    onDragStart={(e) => onDragStart(e, component)}
                                    key={component.id}
                                    draggable={true}
                                    sx={getCommonContainerStyle()}
                                >
                                    <Box sx={commonLogoStyle} >
                                        <DynamicComponentIcon id={component.id} />
                                    </Box>
                                    <Box>
                                        <Typography color={component.bgColor} fontSize={15} >{component.header}</Typography>
                                        <Typography color={'#454545'} fontSize={12} >
                                            {component.description.substring(0, 68)}
                                            {component.description.length > 68 ? '...' : ''}
                                        </Typography>
                                    </Box>
                                    <Box marginTop={'20px'} color={component.bgColor}>
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