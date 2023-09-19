import { Box, IconButton, Rating, Typography } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useEffect, useState } from 'react';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getCenterAlignmentStyle, getColorsFromTheme } from '../Utils/FeedbackUtils';
import { TEMPLATE_KEY } from '../Utils/Constants';

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

    return (
        <Box sx={getSurveyDisplayContainerStyle(position, props.surveyId === TEMPLATE_KEY)} textAlign={'center'} padding={'15px'}>
            <Box height={'90vh'} sx={{ ...getCenterAlignmentStyle(), overflowY: 'scroll', textAlign: 'center', overflowWrap: 'break-word' }} >
                <Box marginTop={'10px'} sx={{ overflowY: 'scroll' }} >
                    <Typography fontSize={'28px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.question}</Typography>
                    <Rating
                        // sx={{ fontSize: '40px', color: colors?.primaryColor, }}
                        sx={{
                            fontSize : '40px',
                            // '& .MuiRating-iconEmpty': {
                            //   color: colors?.shade,
                            // },
                            '& .MuiRating-iconFocus': {
                              color: colors?.primaryColor,
                            },
                            '& .MuiRating-iconHover': {
                              color: colors?.primaryColor,
                            },
                        }}
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