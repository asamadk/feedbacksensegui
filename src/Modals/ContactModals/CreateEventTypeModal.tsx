import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { createUsageEventTypeURL } from '../../Utils/Endpoints';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import { Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography, styled } from '@mui/material';
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../../Styles/ModalStyle';
import { colorPalette } from '../../Utils/Constants';
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import Notification from '../../Utils/Notification';
import { muiSelectStyle, textFieldStyle } from '../../Styles/InputStyles';
import { eventTypeOptions } from '../../Utils/EventConstants';


const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

function CreateEventTypeModal(props: any) {
    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = useState(false);


    const [name, setName] = useState('');
    const [type, setType] = useState('');

    let init = false;
    useEffect(() => {
        if (init === false) {
            if (props.data != null) {
                populateUsageEventType(props.data);
            }
            init = true;
        }
    }, [props.data]);

    function populateUsageEventType(eventType: any) {
        setName(eventType.eventName);
        setType(eventType.eventType);
    }

    const handleClose = () => {
        props.close({ refresh: false });
    }


    async function handleCreateUsageEventType() {
        const payload: any = {
            name: name,
            type: type
        }

        if (props.data != null) {
            payload.id = props.data.id;
        }

        if (
            payload.name == null || payload.name.length < 1 ||
            payload.type == null || payload.type.length < 1
        ) {
            snackbarRef?.current?.show('Please select all the required values', 'warning');
            return;
        }

        try {
            setLoading(true);
            await axios.post(createUsageEventTypeURL(), payload, { withCredentials: true });
            props.close({ refresh: true });
            setLoading(false);
        } catch (error) {
            snackbarRef?.current?.show('Something went wrong', 'error');
            setLoading(false);
            handleUnAuth(error);
        }
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{...modalStyle(colorPalette.background),width : '25%'}}>
                    <Box sx={modalHeaderStyle} >
                        <Box>
                            <Typography id="modal-modal-title" variant="h5" component="h2" >
                                {props.data != null ? 'Update' : 'Create'} Event Type
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    <Box marginTop={'20px'} >
                        <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Custom Event Name*</Typography>
                        <CssTextField
                            size='small'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ input: { color: colorPalette.darkBackground } }}
                            fullWidth
                        />
                    </Box>
                    <Box marginTop={'20px'} >
                        <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Custom Event Type*</Typography>
                        <CustomSelect
                            size='small'
                            placeholder='plan'
                            value={type}
                            onChange={(e) => setType(e.target.value as string)}
                            fullWidth
                        >
                            {
                                eventTypeOptions.map(opt => (
                                    <MenuItem value={opt.value} >{opt.label}</MenuItem>
                                ))
                            }
                        </CustomSelect>
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
                            onClick={handleCreateUsageEventType}
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

export default CreateEventTypeModal