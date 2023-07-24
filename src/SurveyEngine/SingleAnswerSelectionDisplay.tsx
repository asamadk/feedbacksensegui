import { Box, Button, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, Tooltip, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getCenterAlignmentStyle, getColorsFromTheme } from '../Utils/FeedbackUtils';

function SingleAnswerSelectionDisplay(props: any) {

    const [colors, setColors] = useState<any>();
    const [textColor, setTextColor] = useState('');
    const [position, setPosition] = useState('absolute');
    const [selectedRadio, setSelectedRadio] = useState('');
    const [selectedChecks, setSelectedChecks] = useState<Set<any>>(new Set<any>());

    const isSmallScreen = useMediaQuery('(max-width: 600px)');

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
        setTextColor(currentTheme.textColor);
    }

    const handleRadioChange = (e: any) => {
        const selectedRadio = e.target.value
        setSelectedRadio(selectedRadio);
    }

    const handleCheckboxClicks = (e: any) => {
        const isChecked: boolean = e.target.checked;
        const val = e.target.value;
        if (isChecked === true) {
            const tempVal = selectedChecks;
            tempVal.add(val);
            setSelectedChecks(tempVal);
        } else {
            const tempVal = selectedChecks;
            tempVal.delete(val);
            setSelectedChecks(tempVal);
        }
    }

    const next = () => {
        if (props.type === 'single') {
            const res = {
                type: props.type,
                selectedVal: selectedRadio
            }
            props.next(res);
        } else {
            const res = {
                type: props.type,
                selectedVal: Array.from(selectedChecks)
            }
            props.next(res);
        }
    }

    const selectionBlock = {
        padding: '10px',
        paddingBottom: '0',
        backgroundColor: colors?.shade,
        color: colors?.primaryColor,
        borderRadius: '10px',
        textAlign: 'start',
        width: isSmallScreen === true ? '80%' : '55%',
        margin: "auto",
        marginBottom: '10px',
        overflowX : 'scroll',
    }

    const RadioButtonStyle = {
        color: colors?.primaryColor,
        '&.Mui-checked': {
            color: colors?.primaryColor,
        },
    }

    return (
        <Box sx={getSurveyDisplayContainerStyle(position)} style={{ width: '95%' }} textAlign={'center'}>
            <Box height={'90vh'} sx={{ ...getCenterAlignmentStyle(), overflowY: 'scroll',overflowWrap : 'break-word' }} >
                <Box marginTop={'10px'} sx={{overflowY : 'scroll'}} >
                    <Typography fontSize={'26px'} color={colors?.primaryColor} fontWeight={400} >{props?.data?.question}</Typography>
                    {
                        props.type === 'single' ?
                            <RadioGroup name="radio-buttons-group" >
                                {
                                    props?.data?.answerList?.map((answer: string) => {
                                        return (
                                            <Box sx={selectionBlock} >
                                                <FormControlLabel
                                                    sx={{ position: 'relative', top: '-5px',overflowWrap : 'break-word' }}
                                                    value={answer}
                                                    control={<Radio sx={RadioButtonStyle} />}
                                                    // label={answer}
                                                    label={<Typography>{answer}</Typography>}
                                                    onChange={handleRadioChange}
                                                />
                                            </Box>
                                        )
                                    })
                                }
                            </RadioGroup> :
                            <FormGroup>
                                {
                                    props?.data?.answerList?.map((answer: string) => {
                                        return (
                                            <Box sx={selectionBlock} >
                                                <FormControlLabel
                                                    sx={{ position: 'relative', top: '-5px' }}
                                                    value={answer}
                                                    control={<Checkbox sx={RadioButtonStyle} />}
                                                    label={answer}
                                                    onChange={handleCheckboxClicks}
                                                />
                                            </Box>
                                        )
                                    })
                                }
                            </FormGroup>
                    }
                    <Button
                        onClick={next}
                        sx={{
                            "&.MuiButtonBase-root:hover": {
                                bgcolor: colors?.shade
                            },
                            backgroundColor: colors?.primaryColor,
                            color: textColor,
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

export default SingleAnswerSelectionDisplay