import { Box, Button, TextField, Typography } from '@mui/material'
import { containedButton } from '../Styles/ButtonStyle'

function ContactDisplay(props : any) {
  return (
    <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'10%'} marginBottom={'10%'}>
        <Box height={'90vh'} overflow={'scroll'} >
            <Typography fontSize={'26px'} color={'#29292a'} fontWeight={300} >{props?.data?.question}</Typography>
            <Box marginTop={'10px'} >
                {
                    props?.data?.answerList?.map((answer: string) => {
                        return (
                            <Box key={answer} sx={{padding: '10px', margin: '10px' }}>
                                <TextField variant='outlined' fullWidth size='small' label={answer}></TextField>
                            </Box>
                        )
                    })
                }
            </Box>
            <Button style={{ width: 'fit-content' }} sx={containedButton} variant="contained" >Submit</Button>
        </Box>
    </Box>
  )
}

export default ContactDisplay