import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { containedButton } from '../Styles/ButtonStyle'
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function ContactDisplay(props: any) {

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
        <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'2%'} marginBottom={'10%'} overflow={'scroll'} >
            <Box height={'90vh'} overflow={'scroll'} >
                <Typography fontSize={'26px'} color={'#29292a'} fontWeight={300} >{props?.data?.question}</Typography>
                <Box marginTop={'10px'} >
                    {
                        props?.data?.answerList?.map((answer: string) => {
                            return (
                                <Box key={answer} sx={{ padding: '10px', margin: '10px' }}>
                                    <TextField variant='outlined' fullWidth size='small' label={answer}></TextField>
                                </Box>
                            )
                        })
                    }
                </Box>
                <Button style={{
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