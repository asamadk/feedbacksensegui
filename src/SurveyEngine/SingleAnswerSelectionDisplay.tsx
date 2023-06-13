import { Box, Button, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function SingleAnswerSelectionDisplay(props: any) {

    const [colors, setColors] = useState<any>();
    const [textColor, setTextColor] = useState('');
    const [position, setPosition] = useState('absolute');
    const [selectedRadio, setSelectedRadio] = useState('');
    const [selectedChecks, setSelectedChecks] = useState<Set<any>>(new Set<any>());

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

    return (
        <Box sx={getSurveyDisplayContainerStyle(position)} style={{ width: '95%' }} textAlign={'center'}>
            <Box height={'90vh'} overflow={'scroll'} >
                <Typography fontSize={'26px'} color={'#29292a'} fontWeight={300} >{props?.data?.question}</Typography>
                <Box marginTop={'10px'} >
                    {
                        props.type === 'single' ?
                            <RadioGroup name="radio-buttons-group" >
                                {
                                    props?.data?.answerList?.map((answer: string) => {
                                        return (
                                            <Box key={answer}
                                                sx={FormControlStyle}
                                                textAlign={'start'} >
                                                <FormControlLabel
                                                    onChange={handleRadioChange}
                                                    value={answer}
                                                    control={<Radio name='same' />}
                                                    label={answer}
                                                />
                                            </Box>
                                            // <ToggleButtonGroup
                                            //     sx={{marginBottom :  '10px',textAlign : 'start'}}
                                            //     orientation="vertical"
                                            //     exclusive
                                            //     value={answer}
                                            //     onChange={handleRadioChange}
                                            // >
                                            //     <ToggleButton value="list" aria-label="list">
                                            //         <Typography >{answer}</Typography>
                                            //     </ToggleButton>
                                            // </ToggleButtonGroup>
                                        )
                                    })
                                }
                            </RadioGroup> :
                            <FormGroup>
                                {
                                    props?.data?.answerList?.map((answer: string) => {
                                        return (
                                            <Box key={answer}
                                                sx={FormControlStyle}
                                                textAlign={'start'} >
                                                <FormControlLabel
                                                    onChange={handleCheckboxClicks}
                                                    value={answer}
                                                    control={<Checkbox />}
                                                    label={answer}
                                                />
                                            </Box>
                                            // <ToggleButtonGroup
                                            //     orientation="vertical"
                                            //     // value={view}
                                            //     exclusive
                                            // // onChange={handleChange}
                                            // >
                                            //     <ToggleButton value="list" aria-label="list">
                                            //         <Typography>{answer}</Typography>
                                            //     </ToggleButton>
                                            // </ToggleButtonGroup>
                                        )
                                    })
                                }
                            </FormGroup>
                    }
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
        </Box>
    )
}

const FormControlStyle = {
    fontWeight: '300',
    color: '#29292a',
    fontSize: '20px',
    padding: '10px',
    margin: '10px',
    borderRadius: '6px',
    width: '90%',
    border : '1px #454545 solid',
}

export default SingleAnswerSelectionDisplay