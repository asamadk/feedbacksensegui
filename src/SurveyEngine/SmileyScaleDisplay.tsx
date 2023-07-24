import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getCenterAlignmentStyle, getColorsFromTheme } from '../Utils/FeedbackUtils';

function SmileyScaleDisplay(props: any) {

    const [position, setPosition] = useState('absolute');
    const [colors, setColors] = useState<any>();

    useEffect(() => {
        if (props.theme != null) {
            processThemeData();
        }
        if (props.surveyId) {
            setPosition('absolute');
        } else {
            setPosition('relative')
        }
    }, [props]);

    const processThemeData = () => {
        const currentTheme = props.theme;
        setColors(getColorsFromTheme(currentTheme));
    }

    const next = (emojiId: string) => {
        props.next({
            emojiId: emojiId
        });
    }

    return (
        <Box sx={getSurveyDisplayContainerStyle(position)} textAlign={'center'} padding={'15px'} >
            <Box height={'90vh'} sx={{ ...getCenterAlignmentStyle(), overflowY: 'scroll', textAlign: 'center',overflowWrap : 'break-word' }} >
                <Box marginTop={'10px'} sx={{ overflowY: 'scroll' }} >
                <Typography fontSize={'28px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.question}</Typography>
                    <SmileyDisplay
                        next={next}
                    />
                    <Box display={'flex'} justifyContent={'space-around'} >
                        <Typography fontSize={'12px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.leftText}</Typography>
                        <Typography fontSize={'20px'} color={colors?.primaryColor} fontWeight={200} ></Typography>
                        <Typography fontSize={'20px'} color={colors?.primaryColor} fontWeight={200} ></Typography>
                        <Typography fontSize={'20px'} color={colors?.primaryColor} fontWeight={200} ></Typography>
                        <Typography fontSize={'20px'} color={colors?.primaryColor} fontWeight={200} ></Typography>
                        <Typography fontSize={'12px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.rightText}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default SmileyScaleDisplay;

function SmileyDisplay(props: any) {

    const handleMouseEnter = (e: any) => {
        e.target.style.fontSize = '78px'
        e.target.style.transition = '0.3s'
    }

    const handleMouseLeave = (e: any) => {
        e.target.style.fontSize = '58px'
    }

    return (
        <Box marginTop={'20px'} display={'flex'} justifyContent={'space-around'} >
            <Typography id={'0'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => props.next(e.currentTarget.id)} sx={{ cursor: 'pointer' }} fontSize={'58px'} >😡</Typography>
            <Typography id={'1'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => props.next(e.currentTarget.id)} sx={{ cursor: 'pointer' }} fontSize={'58px'} >🙁</Typography>
            <Typography id={'2'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => props.next(e.currentTarget.id)} sx={{ cursor: 'pointer' }} fontSize={'58px'} >😐</Typography>
            <Typography id={'3'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => props.next(e.currentTarget.id)} sx={{ cursor: 'pointer' }} fontSize={'58px'} >🙂</Typography>
            <Typography id={'4'} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={(e) => props.next(e.currentTarget.id)} sx={{ cursor: 'pointer' }} fontSize={'58px'} >😍</Typography>
        </Box>
    )
}