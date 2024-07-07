import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import React from 'react'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../Styles/ModalStyle'
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { outlinedButton } from '../Styles/ButtonStyle';
import { colorPalette } from '../Utils/Constants';

function SurveyLogsModal(props: any) {

    const defaultColor = useSelector((state: any) => state.colorReducer);

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
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Survey Logs
                        </Typography>
                        <IconButton sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={props.close} />
                        </IconButton>
                    </Box>


                    <Box sx={modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={outlinedButton}
                            onClick={props.close}
                            variant="contained"
                        >Cancel</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default SurveyLogsModal