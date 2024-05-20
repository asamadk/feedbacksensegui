import React, { useRef, useState } from 'react'
import { personFieldType } from '../../Utils/types'
import { useSelector } from 'react-redux';
import { Box, Button, MenuItem, Modal, Select, TextField, Typography, styled } from '@mui/material';
import { colorPalette } from '../../Utils/Constants';
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../../Styles/ModalStyle';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import Notification from '../../Utils/Notification';
import { textFieldStyle } from '../../Styles/InputStyles';
import axios from 'axios';
import { handleUnAuth } from '../../Utils/FeedbackUtils';

const CssTextField = styled(TextField)(textFieldStyle);

function EditPersonAttributeModal(props: { open: boolean, close: any, type: personFieldType, value: any, personId: string, update: any }) {

    const snackbarRef: any = useRef(null);
    const globalUsers = useSelector((state: any) => state.users);

    const [loading, setLoading] = useState(false);
    const [localVal, setLocalVal] = useState(props.value);

    function handleValueUpdate(event: any) {
        setLocalVal(event.target.value);
    }

    function getInputLabel(){
        if(props.type === 'firstName'){return 'First Name'}
        else if(props.type === 'lastName'){return 'Last Name'}
        else if(props.type === 'email'){return 'Email'}
        else if(props.type === 'phone'){return 'Phone'}
        else if(props.type === 'title'){return 'Title'}
        else if(props.type === 'communicationPreferences'){return 'Communication Preference'}
        else if(props.type === 'lastContactedDate'){return 'Last Contacted Date'}
    }

    function getFieldDisplay() {
        if (props.type === 'firstName' || props.type === 'lastName' || props.type === 'email' || props.type === 'title') {
            return <>
                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >{getInputLabel()}</Typography>
                <CssTextField onChange={handleValueUpdate} fullWidth size='small' value={localVal} />
            </>
        }else if(props.type === 'phone'){
            return <>
                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >{getInputLabel()}</Typography>
                <CssTextField onChange={handleValueUpdate} fullWidth size='small' type='number' value={localVal} />
            </>
        }else if(props.type === 'communicationPreferences'){
            return <>
                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >{getInputLabel()}</Typography>
                <Select size='small' fullWidth value={localVal} onChange={(e) => setLocalVal(e.target.value)} >
                <MenuItem value="" >None</MenuItem>
                    <MenuItem value="Phone" >Phone</MenuItem>
                    <MenuItem value="Email" >Email</MenuItem>
                </Select>
            </>
        }else if(props.type === 'lastContactedDate'){
            return <>
                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >{getInputLabel()}</Typography>
                <CssTextField onChange={handleValueUpdate} fullWidth size='small' type='date' value={localVal} />
            </>
        }
        return <></>
    }

    function handleClose() {
        props.close();
    }

    function save() { 
        const payload :any= {
            id : props.personId
        }
        payload[props.type] = localVal
        if (localVal == null || localVal?.length < 1) {
            snackbarRef?.current?.show('Please fill all fields', 'warning');
            return;
        }
        try {
            setLoading(true);
            // const URL = ''
            // axios.post(URL, payload, { withCredentials: true })
            setLoading(false);
            props.update(payload);
            snackbarRef?.current?.show('Saved', 'Success');
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
        }
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...modalStyle(colorPalette.background), width: '30%' }}>
                    <Box sx={modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">Edit</Typography>
                    </Box>
                    <Box sx={{ maxHeight: '400px', overflowY: 'scroll' }} >
                        {getFieldDisplay()}
                    </Box>
                    <Box sx={modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={outlinedButton}
                            onClick={handleClose}
                            variant="contained">
                            Cancel
                        </Button>
                        <LoadingButton
                            style={{ width: 'fit-content' }}
                            sx={containedButton}
                            variant="contained"
                            loading={loading}
                            onClick={save}
                        >
                            Save
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default EditPersonAttributeModal