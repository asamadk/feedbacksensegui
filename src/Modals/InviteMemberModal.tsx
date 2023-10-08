import { Button, FormControlLabel, IconButton, InputLabel, Modal, styled, Switch, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import React from 'react'

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#006DFF',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#006DFF',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#454545',
        },
        '&:hover fieldset': {
            borderColor: '#006DFF',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#006DFF',
        },
    },
    color: 'white'
});

const textFieldStyle = {
    paddingTop: '30px'
}

const swtichContainerstyle = {
    paddingTop: '20px'
}

function InviteMemberModal(props: any) {
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
                            Invite your team members !
                        </Typography>
                        <IconButton sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={props.close} />
                        </IconButton>
                    </Box>

                    <Box sx={textFieldStyle} >
                        <InputLabel  htmlFor="component-simple">E-mail(s)</InputLabel>
                        <CssTextField
                            sx={{ input: { color: 'white' } }}
                            size='small'
                            id="outlined-basic"
                            placeholder='e.g sam@example.io'
                            variant="outlined"
                            style={{ width: '100%' }}
                        />
                    </Box>
                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                        <Button style={{width : 'fit-content'}} sx={ButtonStyles.containedButton} variant="contained">Invite</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default InviteMemberModal