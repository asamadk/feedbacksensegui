import { Box, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getCenterAlignmentStyle, getColorsFromTheme } from '../Utils/FeedbackUtils';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { TEMPLATE_KEY } from '../Utils/Constants';

function CSATDisplay(props: any) {

    const [colors, setColors] = useState<any>();
    const isSmallScreen = useMediaQuery('(max-width: 600px)');
    const [position, setPosition] = useState('absolute');

    useEffect(() => {
        if (props.theme != null) {
            processThemeData();
        }
        verifyLiveSurvey();
    }, [props]);

    const verifyLiveSurvey = () => {
        if (props.surveyId) {
            setPosition('absolute');
        } else {
            setPosition('relative')
        }
    }

    const processThemeData = () => {
        const currentTheme = props.theme;
        setColors(getColorsFromTheme(currentTheme));
    }

    const next = (index: any) => {
        props.next({
            value: index
        });
    }

    return (
        <Box sx={getSurveyDisplayContainerStyle(position, props.surveyId === TEMPLATE_KEY)} textAlign={'center'} padding={'15px'} >
            <Box height={'90vh'} sx={{ ...getCenterAlignmentStyle(), overflowY: 'scroll', textAlign: 'center' }} >
                <Box marginTop={'10px'} sx={{ overflowY: 'scroll' }} >
                    <Box>
                    <Typography
                        fontSize={'28px'}
                        sx={{overflowWrap: 'break-word'}}
                        color={colors?.primaryColor}
                        fontWeight={200}
                        width={'fit-content'}
                        margin={'auto'}
                    >
                        {props?.data?.question}
                    </Typography>
                    </Box>
                    <CSATCount
                        next={next}
                        colors={colors}
                    />
                    <Box
                        width={isSmallScreen ? '90%' : '80%'}
                        margin={'auto'}
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Typography fontSize={'12px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.leftText}</Typography>
                        <Typography fontSize={'12px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.rightText}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default CSATDisplay

function CSATCount(props : any){
    return(
        <Box
            width={'fit-content'}
            margin={'auto'}
            flexWrap={'wrap'}
            marginTop={'20px'}
            marginBottom={'20px'}
            display={'flex'}
            justifyContent={'start'}
        >
            <Box
                sx={{ cursor: 'pointer', marginRight: '7px', marginTop: '5px', width: '15px' }}
                onClick={() => props.next('1')}
                padding={'15px'}
                borderRadius={'5px'}
                bgcolor={props?.colors?.shade}
            >
                <Typography color={props?.colors?.primaryColor} >{'1'}</Typography>
            </Box>
            <Box
                sx={{ cursor: 'pointer', marginRight: '7px', marginTop: '5px', width: '15px' }}
                onClick={() => props.next('2')}
                padding={'15px'}
                borderRadius={'5px'}
                bgcolor={props?.colors?.shade}
            >
                <Typography color={props?.colors?.primaryColor} >{'2'}</Typography>
            </Box>
            <Box
                sx={{ cursor: 'pointer', marginRight: '7px', marginTop: '5px', width: '15px' }}
                onClick={() => props.next('3')}
                padding={'15px'}
                borderRadius={'5px'}
                bgcolor={props?.colors?.shade}
            >
                <Typography color={props?.colors?.primaryColor} >{'3'}</Typography>
            </Box>
            <Box
                sx={{ cursor: 'pointer', marginRight: '7px', marginTop: '5px', width: '15px' }}
                onClick={() => props.next('4')}
                padding={'15px'}
                borderRadius={'5px'}
                bgcolor={props?.colors?.shade}
            >
                <Typography color={props?.colors?.primaryColor} >{'4'}</Typography>
            </Box>
            <Box
                sx={{ cursor: 'pointer', marginRight: '7px', marginTop: '5px', width: '15px' }}
                onClick={() => props.next('5')}
                padding={'15px'}
                borderRadius={'5px'}
                bgcolor={props?.colors?.shade}
            >
                <Typography color={props?.colors?.primaryColor} >{'5'}</Typography>
            </Box>
        </Box>
    )
}