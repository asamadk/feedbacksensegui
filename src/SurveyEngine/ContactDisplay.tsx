import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getCenterAlignmentStyle, getColorsFromTheme } from '../Utils/FeedbackUtils';
import { TEMPLATE_KEY } from '../Utils/Constants';

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
            console.warn("Exception handleTextChange ~ error:", error);
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
        <Box sx={getSurveyDisplayContainerStyle(position,props.surveyId === TEMPLATE_KEY)} textAlign={'center'} overflow={'scroll'} >
            <Box height={'90vh'} sx={{ ...getCenterAlignmentStyle(), overflowY: 'scroll', textAlign: 'center' }} >
                <Box marginTop={'10px'} sx={{ overflowY: 'scroll',overflowWrap : 'break-word' }} >
                    <Typography fontSize={'26px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.question}</Typography>
                    <Box marginTop={'20px'} >
                        {
                            props?.data?.answerList?.map((answer: string,index :number) => {
                                return (
                                    <Box key={answer+index} >
                                        <Box key={answer+index} sx={{ padding: '5px', marginTop: '5px' }}>
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
            </Box>
        </Box>
    )
}

export default ContactDisplay