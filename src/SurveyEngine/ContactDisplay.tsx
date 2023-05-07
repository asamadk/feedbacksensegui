import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { containedButton } from '../Styles/ButtonStyle'
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function ContactDisplay(props: any) {

    const [colors, setColors] = useState<any>();
    const [textColor, setTextColor] = useState('');
    const [position, setPosition] = useState('absolute');
    const [answerResult, setAnswerResult] = useState<any>();

    useEffect(() => {
        if (props.theme != null) {
            processThemeData();
        }
        verifyLiveSurvey();
        populateAnswerResult();
    }, [props]);

    const verifyLiveSurvey = () => {
        if (props.surveyId) {
            setPosition('absolute');
        } else {
            setPosition('relative')
        }
    }

    const populateAnswerResult = () => {
        const answerList : any[]= props?.data?.answerList;
        if(answerList == null || answerList?.length < 1){
            return;
        }
        let obj : any= {};
        answerList.forEach((answer : string) => {
            obj[answer] = '';
        });
        setAnswerResult(obj);
    }

    const processThemeData = () => {
        const currentTheme = props.theme;
        setColors(getColorsFromTheme(currentTheme));
        setTextColor(currentTheme.textColor);
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
        try {
          const val = e.target.value;
          const tempAnswerResult = JSON.parse(JSON.stringify(answerResult));
          tempAnswerResult[key] = val;
          setAnswerResult(tempAnswerResult);
        } catch (error) {
          console.log("🚀 ~ handleTextChange ~ error:", error);
        }
      }

    const next = () => {
        props.next(answerResult);
    }

    return (
        <Box sx={getSurveyDisplayContainerStyle(position)} textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={0} overflow={'scroll'} >
            <Box height={'90vh'} overflow={'scroll'} >
                <Typography fontSize={'26px'} color={'#29292a'} fontWeight={300} >{props?.data?.question}</Typography>
                <Box marginTop={'10px'} >
                    {
                        props?.data?.answerList?.map((answer: string) => {
                            return (
                                <Box key={answer} >
                                    <Box key={answer} sx={{ padding: '10px', margin: '10px' }}>
                                        <TextField 
                                            onChange={(e) => handleTextChange(e,answer)}
                                            value={answerResult != null && answerResult[answer] != null ? answerResult[answer] : ''} 
                                            variant='outlined' 
                                            fullWidth
                                            size='small' 
                                            label={answer}>
                                        </TextField>
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
                <Button 
                    onClick={next}
                    style={{
                    width: 'fit-content',
                    marginRight: '15px',
                    backgroundColor: colors?.secondaryColor,
                    color: textColor
                }} sx={containedButton} variant="contained" >Submit</Button>
            </Box>
        </Box>
    )
}

export default ContactDisplay