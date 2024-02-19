import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTabSet from '../Components/CustomTabSet'
import { useNavigate } from 'react-router';
import ReactJoyride, { CallBackProps, STATUS } from 'react-joyride';
import { joyrideState } from '../Utils/types';
import { colorPalette, joyrideConstants } from '../Utils/Constants';

const tabSetList = [
    { id: 0, name: 'Workspaces' },
    { id: 1, name: 'Templates' },
    { id: 2, name: 'Contacts' },
    { id: 3, name: 'Dashboard' },
];

function MainHeaderTab(props : {joyrideStart : boolean}) {

    const navigate = useNavigate();
    const [tabset, setTabSet] = React.useState(0);

    const handleTabChange = (value : number) =>  {
        setTabSet(value);
        if(value === 0){
            navigate('/');
        }else if(value === 1){
            navigate('/template')
        }else if(value === 2){
            navigate('/integration')
        }else if(value === 3){
            navigate('/dashboard')
        }
    }

    const [{ run, steps, stepIndex }, setState] = useState<joyrideState>({
        run: false,
        stepIndex: 0,
        steps: [
            {
                content: <h2>
                    Start custom surveys from scratch with ready-made templates from here
                </h2>,
                target: '.main-header-tab',
                disableBeacon: true,
                disableOverlayClose: true,
                placement: 'bottom',
                styles: {
                    options: {
                        zIndex: 10000,
                    },
                },
            }
        ],
    });

    useEffect(() => {
        handleJoyrideVisibility();
    }, [props.joyrideStart]);

    useEffect(() => {
        handleJoyrideVisibility();
    }, []);

    useEffect(() => {
        handlePathChange();
    },[window.location.pathname]);

    const handlePathChange = () => {
        const pathName : string = window.location.pathname;
        if(pathName === '/'){
            setTabSet(0);
        }else if(pathName === '/template'){
            setTabSet(1);
        }else if(pathName === '/integration'){
            setTabSet(2);
        }else if(pathName === '/dashboard'){
            setTabSet(3);
        }
    }

    const handleJoyrideVisibility = () => {
        const hasSeenPrevJoyride = localStorage.getItem(joyrideConstants.JOYRIDE_5);
        if (!hasSeenPrevJoyride) {
            setState({
                run: false,
                steps: steps,
                stepIndex: 0,
            });
            return;
        }
        const hasSeenJoyride = localStorage.getItem(joyrideConstants.JOYRIDE_6);
        if (!hasSeenJoyride) {
            setState({
                run: true,
                steps: steps,
                stepIndex: 0,
            });
            localStorage.setItem(joyrideConstants.JOYRIDE_6, 'true');
        }
    }

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type, index, action } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
        if (finishedStatuses.includes(status)) {
            setState({ run: false, steps: steps, stepIndex: 0, });
        }
    };

    return (
        <>
            <ReactJoyride
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
            <Box className='main-header-tab' sx={{ display: 'flex', justifyContent: 'center' }} >
                <CustomTabSet
                    tabsetList={tabSetList}
                    change={(value: number) => handleTabChange(value)}
                    index={tabset}
                />
            </Box>
        </>
    )
}

export default MainHeaderTab