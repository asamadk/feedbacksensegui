import { Box, IconButton, Rating, Typography } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useEffect, useState } from 'react';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function RatingScaleDisplay(props: any) {

    const [colors, setColors] = useState<any>();
    const [position, setPosition] = useState('absolute');

    useEffect(() => {
        if (props.theme != null) {
            processThemeData();
        }
        verifyLiveSurvey();
    }, [props]);

    const processThemeData = () => {
        const currentTheme = props.theme;
        setColors(getColorsFromTheme(currentTheme));
    }

    const verifyLiveSurvey = () => {
        if (props.surveyId) {
            setPosition('absolute');
        } else {
            setPosition('relative')
        }
    }

    const next = (index: any) => {
        props.next({
            value: index
        });
    }

    const primaryContainerStyle = {
        backgroundColor : colors?.shade,
        borderRadius : '10px',
        padding : '15px',
        width : '90%',
        margin : 'auto',
    }

    return (
        <Box sx={getSurveyDisplayContainerStyle(position)} textAlign={'center'}>
            <Box sx={primaryContainerStyle} >
                <Typography fontSize={'28px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.question}</Typography>
                    <Rating
                        sx={{fontSize : '40px',color : colors?.primaryColor,}}
                        size='large'
                        max={props?.data?.range}
                        name="simple-controlled"
                        onChange={(event, newValue) => {
                            next(newValue)
                        }}
                    />
                <Box display={'flex'} justifyContent={'space-around'} >
                    <Typography fontSize={'12px'} color={colors?.primaryColor} fontWeight={500} >{props?.data?.leftText}</Typography>
                    {
                        Array.from(Array((props?.data?.range))?.keys())?.map(ran => {
                            return (
                                <Typography key={ran} fontSize={'20px'} color={'#29292a'} fontWeight={400} ></Typography>
                            )
                        })
                    }
                    <Typography fontSize={'12px'} color={colors?.primaryColor} fontWeight={500} >{props?.data?.rightText}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default RatingScaleDisplay

function RatingDisplay(props: any) {
    return (
        <Box marginTop={'20px'} display={'flex'} justifyContent={'space-around'} flexWrap={'wrap'} >
            {
                Array.from(Array(props?.range)?.keys())?.map((ran, index) => {
                    return (
                        <Box key={ran} >
                            <IconButton onClick={() => props.next(index)} >
                                <StarBorderIcon sx={{ fontSize: '58px' }} fontSize='large' />
                            </IconButton>
                        </Box>
                    )
                })
            }
        </Box>
    )
}