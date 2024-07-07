import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../../Styles/ModalStyle'
import { colorPalette } from '../../Utils/Constants'
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import Notification from '../../Utils/Notification';

function CreateActivityModal(props: any) {

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        props.close({ refresh: false });
    }

    function handleCreateActivity(){}

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle(colorPalette.background)}>
                    <Box sx={modalHeaderStyle} >
                        <Box>
                            <Typography id="modal-modal-title" variant="h5" component="h2" >
                                {props.data != null ? 'Update' : 'Create'} Activity
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>


                    <Box sx={modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={outlinedButton}
                            onClick={handleClose}
                            variant="contained"
                        >Cancel</Button>
                        <LoadingButton
                            style={{ width: 'fit-content' }}
                            sx={containedButton}
                            variant="contained"
                            loading={loading}
                            onClick={handleCreateActivity}
                        >
                            {props.data != null ? 'Update' : 'Create'}
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default CreateActivityModal