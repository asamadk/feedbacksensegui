import { Box, Modal } from '@mui/material';
import React from 'react'
import { modalStyle } from '../Styles/ModalStyle';
import { colorPalette } from '../Utils/Constants';

function CreateSurveyJoyride(props: any) {

    const handleClose = () => {
        props.close();
    }

    return (
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ ...modalStyle(colorPalette.background), width: '80%' }}>
                <div style={{ position: 'relative', paddingBottom: 'calc(52.361111111111114% + 50px)', height: '0' }}>
                    <iframe
                        src="https://app.guideflow.com/embed/yr4wg9b4p3"
                        width="100%"
                        height="100%"
                        style={{ overflow: 'hidden', position: 'absolute', border: 'none' }}
                        scrolling="no"
                        allow="clipboard-read; clipboard-write"
                    ></iframe>
                </div>
            </Box>
        </Modal>
    )
}

export default CreateSurveyJoyride