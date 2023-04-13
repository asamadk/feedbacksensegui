import { Box, Button, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function SingleAnswerSelectionDisplay(props: any) {

    const [colors, setColors] = useState<any>();
    const [textColor, setTextColor] = useState('');

    useEffect(() => {
        if (props.theme != null) {
            processThemeData();
        }
    }, [props]);

    const processThemeData = () => {
        const currentTheme = props.theme;
        setColors(getColorsFromTheme(currentTheme));
        setTextColor(currentTheme.textColor);
    }

    return (
        <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'10%'} marginBottom={'10%'}>
            <Box height={'90vh'} overflow={'scroll'} >
                <Typography fontSize={'26px'} color={'#29292a'} fontWeight={300} >{props?.data?.question}</Typography>
                <Box marginTop={'10px'} >
                    {
                        props.type === 'single' ?
                            <RadioGroup name="radio-buttons-group" >
                                {
                                    props?.data?.answerList?.map((answer: string) => {
                                        return (
                                            <Box key={answer} sx={{ fontWeight: '300', color: '#29292a', fontSize: '20px', border: '0.5px #454545 solid', padding: '10px', margin: '10px', borderRadius: '5px', width: '90%' }} textAlign={'start'} >
                                                <FormControlLabel value={answer} control={<Radio name='same' />} label={answer} />
                                            </Box>
                                        )
                                    })
                                }
                            </RadioGroup> :
                            <FormGroup>
                                {
                                    props?.data?.answerList?.map((answer: string) => {
                                        return (
                                            <Box key={answer} sx={{ fontWeight: '300', color: '#29292a', fontSize: '20px', border: '0.5px #454545 solid', padding: '10px', margin: '10px', borderRadius: '5px', width: '90%' }} textAlign={'start'} >
                                                <FormControlLabel value={answer} control={<Checkbox />} label={answer} />
                                            </Box>
                                        )
                                    })
                                }
                            </FormGroup>
                    }
                    <Button style={{
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

export default SingleAnswerSelectionDisplay