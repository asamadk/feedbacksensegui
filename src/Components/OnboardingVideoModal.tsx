import { Box, Button, IconButton, Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../Styles/ModalStyle'
import { colorPalette } from '../Utils/Constants'
import { outlinedButton } from '../Styles/ButtonStyle';
import { useDispatch } from 'react-redux';
import { setLoader } from '../Redux/Reducers/LoadingReducer';

function OnboardingVideoModal(props: { open: boolean, close: any }) {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoader(true));
        setTimeout(() => {
            dispatch(setLoader(false));
        },3000);
    },[]);

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...modalStyle(colorPalette.background), width: '60%' }}>
                    <Box sx={modalHeaderStyle} >
                        <Box>
                            <Typography id="modal-modal-title" variant="h5" component="h2" >
                                Quick Introduction
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={props.close} />
                        </IconButton>
                    </Box>

                    <Box marginTop={'20px'} >
                        <div style={{ position: 'relative', paddingBottom: 'calc(52.361111111111114% + 50px)', height: '0' }}>
                            <iframe
                                id="xrg86ggi1p" src="https://app.guideflow.com/embed/xrg86ggi1p"
                                width="100%"
                                height="100%"
                                style={{ overflow: 'hidden', position: 'absolute', border: 'none' }}
                                scrolling="no"
                                allow="clipboard-read; clipboard-write"
                            ></iframe>
                        </div>
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

export default OnboardingVideoModal