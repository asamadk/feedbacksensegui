import { Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../Styles/ModalStyle';
import { colorPalette, flowTypes } from '../Utils/Constants';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import { muiSelectStyle, textFieldStyle } from '../Styles/InputStyles';
import { handleUnAuth } from '../Utils/FeedbackUtils';
import axios from 'axios';
import { endpoints } from '../Utils/Endpoints';
import { useDispatch } from 'react-redux';
import { showNotification } from '../Redux/Reducers/NotificationReducer';

const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

function CreateFlowModal(props: { open: boolean, close: any }) {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [flowName, setFlowName] = useState('');
    const [flowType, setFlowType] = useState('company');

    useEffect(() => {
        setFlowName('');
        setFlowType('company')
    },[]);

    const handleClose = () => {
        props.close({ refresh: false });
    }

    async function handleCreateFlow() {
        try {
            if (flowName == null || flowName.length < 1 || flowType == null || flowType.length < 1) {
                dispatch(showNotification('Please provide all values', 'error'));
                return;
            }
            const payload = {
                name: flowName,
                type: flowType
            }
            setLoading(true);
            const { data } = await axios.post(endpoints.flows.create, payload, { withCredentials: true });
            setLoading(false);
            dispatch(showNotification(data.message, 'success'));
            props.close({refresh : true});
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
            dispatch(showNotification('Something went wrong', 'error'));
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
                <Box sx={{ ...modalStyle(colorPalette.background), width: '25%' }}>
                    <Box sx={modalHeaderStyle} >
                        <Box>
                            <Typography id="modal-modal-title" variant="h5" component="h2" >
                                Create Flow
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    <Box marginTop={'20px'} >
                        <CssTextField
                            size='small'
                            value={flowName}
                            onChange={(e) => setFlowName(e.target.value)}
                            fullWidth
                            placeholder='Flow Name'
                        />

                        <CustomSelect
                            value={flowType}
                            onChange={(e) => setFlowType(e.target.value as string)}
                            size='small'
                            fullWidth
                            sx={{ marginTop: '10px' }}
                            placeholder='Select Type'
                        >
                            {flowTypes.map(type => <MenuItem value={type.value} >{type.key}</MenuItem>)}
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
                            onClick={handleCreateFlow}
                        >
                            Create
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default CreateFlowModal