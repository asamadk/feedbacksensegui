import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { Box, Button, Divider, IconButton, Modal, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#FFA500',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#FFA500',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#454545',
        },
        '&:hover fieldset': {
            borderColor: '#FFA500',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FFA500',
        },
    },
    color: 'white'
});

function WelcomModal(props: any) {

    const [welcomeText, setWelcomeText] = React.useState('');
    const [buttonText, setButtonText] = React.useState('');

    const handleSave = () => {
        let obj = {
            welcomeText: welcomeText,
            buttonText: buttonText
        }

        if(verifyComponent() === false){
            return;
        }

        props.save(JSON.stringify(obj));
    }

    const verifyComponent = () : Boolean => {
        return true;
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyles.modalStyle}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            {props.header}
                        </Typography>
                        <IconButton color='warning' sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={props.close} />
                        </IconButton>
                    </Box>

                    <Box sx={ModalStyles.modalBodyContainerStyle} >
                        <CssTextField
                            sx={{ input: { color: 'white' } }}
                            id="outlined-basic"
                            placeholder='Enter your message here.'
                            variant="outlined"
                            size={'small'}
                            value={welcomeText}
                            style={{ width: '100%' }}
                            onChange={(e) => setWelcomeText(e.target.value)}
                        />

                        <Divider sx={{ marginTop: '10px', marginBottom: '10px' }} />

                        <CssTextField
                            sx={{ input: { color: 'white' } }}
                            id="outlined-basic"
                            placeholder='Button label.'
                            variant="outlined"
                            size={'small'}
                            value={buttonText}
                            style={{ width: '100%' }}
                            onChange={(e) => setButtonText(e.target.value)}
                        />
                    </Box>

                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                        <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default WelcomModal;