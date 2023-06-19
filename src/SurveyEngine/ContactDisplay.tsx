import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getCenterAlignmentStyle, getColorsFromTheme } from '../Utils/FeedbackUtils';

function ContactDisplay(props: any) {

    const isSmallScreen = useMediaQuery('(max-width: 600px)');
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
        const answerList: any[] = props?.data?.answerList;
        if (answerList == null || answerList?.length < 1) {
            return;
        }
        let obj: any = {};
        answerList.forEach((answer: string) => {
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

    const inputStyleCSS = {
        borderRadius: '10px',
        width: isSmallScreen === true ? '80%' : '55%',
        border: 'none',
        padding: '12px',
        backgroundColor: colors?.shade,
        color: colors?.primaryColor,
        margin: 'auto'
    }

    return (
        <Box sx={getSurveyDisplayContainerStyle(position)} textAlign={'center'} overflow={'scroll'} >
            <Box overflow={'scroll'} sx={getCenterAlignmentStyle()} >
                <Typography fontSize={'26px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.question}</Typography>
                <Box marginTop={'10px'} >
                    {
                        props?.data?.answerList?.map((answer: string) => {
                            return (
                                <Box key={answer} >
                                    <Box key={answer} sx={{ padding: '5px', marginTop: '5px' }}>
                                        <input
                                            style={inputStyleCSS}
                                            value={answerResult != null && answerResult[answer] != null ? answerResult[answer] : ''}
                                            placeholder={answer}
                                            onChange={(e) => handleTextChange(e, answer)}
                                        />
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>
            <Button
                onClick={next}
                style={{
                    width: 'fit-content',
                    backgroundColor: colors?.primaryColor,
                    color: textColor,
                    marginTop: '10px'
                }}
                variant="contained"
            >
                Submit
            </Button>
        </Box>
    )
}

export default ContactDisplay