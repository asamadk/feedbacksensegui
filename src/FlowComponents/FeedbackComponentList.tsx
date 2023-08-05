import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Joyride from 'react-joyride';
import DynamicComponentIcon from './DynamicComponentIcon'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { STATUS } from 'react-joyride';
import { CallBackProps } from 'react-joyride';
import { Step } from 'react-joyride';

const getCommonContainerStyle = (isAvailable: boolean) => {
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
        cursor: isAvailable === true ? 'pointer' : 'not-allowed'
    }
}

const commonLogoStyle = {
    marginTop: '20px',
    marginRight: '10px'
}

const componentList = [
    {
        id: 1,
        bgColor: '#00B3EC',
        header: 'Welcome message',
        description: 'Take a moment to introduce the purpose of your survey or say hi to your audience.',
        isAvailable: true
    },
    // {
    //     id: 2,
    //     bgColor: '#F6AE2D',
    //     header: 'Thank you screen',
    //     description: 'It is an important part of survey experience to ensure that users feel valued and appreciated.',
    //     isAvailable : false
    // },
    {
        id: 3,
        bgColor: '#9E4784',
        header: 'Single answer selection',
        description: 'Get people to select only one option. Good for getting definite answers.',
        isAvailable: true
    },
    {
        id: 4,
        bgColor: '#F26419',
        header: 'Multiple answer selection',
        description: 'Let people choose multiple answers from a list. Use it when more than one answer applies.',
        isAvailable: true
    },
    {
        id: 5,
        bgColor: '#539165',
        header: 'Text answer',
        description: 'Provide a text box so people can share written, open-ended feedback.',
        isAvailable: true
    },
    {
        id: 6,
        bgColor: '#EA8FEA',
        header: 'Smiley scale',
        description: 'Ask people to rate something on a visual smiley scale. .',
        isAvailable: true
    },
    {
        id: 7,
        bgColor: '#E9967A',
        header: 'Rating scale',
        description: 'Ask people to rate something. Great for measuring satisfaction. ',
        isAvailable: true
    },
    {
        id: 8,
        bgColor: '#E4DCCF',
        header: 'NPS',
        description: 'Measure brand loyalty on a scale from 0 to 10 and get a predictor of repurchases & referrals.',
        isAvailable: true
    },
    // {
    //     id: 9,
    //     bgColor: '#C1AEFC',
    //     header: 'Dropdown List',
    //     description: 'Let people pick one answer from a dropdown list of choices. Great for space-saving reasons.'
    // },
    // {
    //     id: 10,
    //     bgColor: '#D1FFF3',
    //     header: 'Matrix',
    //     description: 'Provide one or multiple row answers and the same set of column choices to evaluate them with.'
    // },
    {
        id: 11,
        bgColor: '#0F6292',
        header: 'Contact form',
        description: 'Collect contact information such as name, email, then create contacts in your CRM if .',
        isAvailable: true
    },
    // {
    //     id: 12,
    //     bgColor: '#CD5888',
    //     header: 'Ranking answer',
    //     description: 'Ask people to rank multiple answer choices in the order of preference or importance.',
    //      isAvailable : true
    // },
    {
        id: 13,
        bgColor: '#9E4784',
        header: 'Date',
        description: 'Let people enter a specific date. This component is useful in areas where people need to select date/time',
        isAvailable: true
    },
];


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
                            <Box
                                onMouseEnter={onHoverStart}
                                onMouseLeave={onHoverEnd}
                                onDragStart={(e) => onDragStart(e, component)}
                                key={component.id}
                                draggable={component.isAvailable}
                                sx={getCommonContainerStyle(component.isAvailable)}
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
                        </div>
                    )
                })
            }
        </Box>
    )
}

export default FeedbackComponentList