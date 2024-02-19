import { Box, Button, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, Tooltip, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getCenterAlignmentStyle, getColorsFromTheme } from '../Utils/FeedbackUtils';
import { TEMPLATE_KEY } from '../Utils/Constants';

function SingleAnswerSelectionDisplay(props: any) {

    const [colors, setColors] = useState<any>();
    const [textColor, setTextColor] = useState('');
    const [position, setPosition] = useState('absolute');
    const [selectedRadio, setSelectedRadio] = useState('');
    const [selectedChecks, setSelectedChecks] = useState<Set<any>>(new Set<any>());
    const containerRef = useRef<HTMLDivElement>(null); // Ref to the container element
    const [showScrollDown, setShowScrollDown] = useState(false); // State to control the visibility of the scroll down icon

    const isSmallScreen = useMediaQuery('(max-width: 600px)');

    useEffect(() => {
        if (props.theme != null) {
            processThemeData();
        }
        verifyLiveSurvey();

        handleOverflow();

        // Add event listener for "Enter" key press
        document.addEventListener('keydown', handleKeyPress);

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [props]);

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            next();
        }
    };

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
        overflowX: 'scroll',
    }

    const RadioButtonStyle = {
        color: colors?.primaryColor,
        '&.Mui-checked': {
            color: colors?.primaryColor,
        },
    }

    const handleOverflow = () => {
        const container = containerRef.current;
        if (container && container.scrollHeight > container.clientHeight) {
            console.log('Overflow');
            setShowScrollDown(true); // If content overflows, show the scroll down icon
        } else {
            console.log('No Overflow');
            setShowScrollDown(false); // Otherwise, hide the scroll down icon
        }
    };

    return (
        <Box sx={getSurveyDisplayContainerStyle(position, props.surveyId === TEMPLATE_KEY)} textAlign={'center'}>
            <Box height={'90vh'} sx={{ ...getCenterAlignmentStyle(), overflowY: 'scroll', overflowWrap: 'break-word' }} >
                <Box ref={containerRef} marginTop={'10px'} sx={{ overflowY: 'scroll' }} >
                    <Typography marginBottom={'20px'} fontSize={'26px'} color={colors?.primaryColor} fontWeight={400} >{props?.data?.question}</Typography>
                    {
                        showScrollDown &&
                        <Typography marginTop={'20px'} color={colors?.primaryColor} >Please <b>Scroll Down</b> for more</Typography>
                    }
                    {
                        props.type === 'single' ?
                            <RadioGroup name="radio-buttons-group" >
                                {
                                    props?.data?.answerList?.map((answer: string) => {
                                        return (
                                            <Box sx={selectionBlock} >
                                                <FormControlLabel
                                                    sx={{ position: 'relative', top: '-5px', overflowWrap: 'break-word' }}
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
                    <Typography marginTop={'20px'} color={colors?.primaryColor} >Press <b>Enter</b> to submit</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default SingleAnswerSelectionDisplay