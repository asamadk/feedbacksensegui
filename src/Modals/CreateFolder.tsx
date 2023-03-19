import { Box, Button, IconButton, InputLabel, Modal, styled, TextField, Typography } from '@mui/material'
import React from 'react'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import CloseIcon from '@mui/icons-material/Close';

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

const textFieldStyle = {
    paddingTop: '30px'
}

function CreateFolder(props: any) {
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
                            Create folder
                        </Typography>
                        <IconButton color='warning' sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={props.close} />
                        </IconButton>
                    </Box>
                    <Box sx={textFieldStyle} >
                        <InputLabel style={{ color: '#f1f1f1', paddingBottom: '3px' }} htmlFor="component-simple">Name your folder</InputLabel>
                        <CssTextField
                            size='small'
                            sx={{ input: { color: 'white' } }}
                            id="outlined-basic"
                            placeholder='Folder name'
                            variant="outlined"
                            style={{ width: '100%' }}
                        />
                    </Box>
                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                        <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained">Create</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default CreateFolder