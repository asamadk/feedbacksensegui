import { Box, IconButton, Typography } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useEffect, useState } from 'react';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';

function RatingScaleDisplay(props: any) {

    const [position, setPosition] = useState('absolute');

    useEffect(() => {
        verifyLiveSurvey();
    }, []);

    const verifyLiveSurvey = () => {
        if (props.surveyId) {
            setPosition('absolute');
        } else {
            setPosition('relative')
        }
    }

    const next = (index : any) => {
        props.next({
            value : index
        });
    }


    return (
        <Box sx={getSurveyDisplayContainerStyle(position)} textAlign={'center'}>
            <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
            <RatingDisplay
                next={next}
                range={props?.data?.range}
            />
            <Box display={'flex'} justifyContent={'space-around'} >
                <Typography fontSize={'12px'} color={'#29292a'} fontWeight={500} >{props?.data?.leftText}</Typography>
                {
                    Array.from(Array((props?.data?.range))?.keys())?.map(ran => {
                        return (
                            <Typography key={ran} fontSize={'20px'} color={'#29292a'} fontWeight={400} ></Typography>
                        )
                    })
                }
                <Typography fontSize={'12px'} color={'#29292a'} fontWeight={500} >{props?.data?.rightText}</Typography>
            </Box>
        </Box>
    )
}

export default RatingScaleDisplay

function RatingDisplay(props: any) {
    return (
        <Box marginTop={'20px'} display={'flex'} justifyContent={'space-around'} flexWrap={'wrap'} >
            {
                Array.from(Array(props?.range)?.keys())?.map((ran,index) => {
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