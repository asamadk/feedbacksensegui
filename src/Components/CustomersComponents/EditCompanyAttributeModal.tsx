import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Chip, Input, MenuItem, Modal, Select, TextField, Tooltip, Typography, styled } from '@mui/material'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../../Styles/ModalStyle';
import { colorPalette } from '../../Utils/Constants';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import Notification from '../../Utils/Notification';
import { companyFieldType } from '../../Utils/types';
import { textFieldStyle } from '../../Styles/InputStyles';
import { getMetricOptions } from '../../Utils/ConditionConstants';
import { useSelector } from 'react-redux';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { updateCompanyURL } from '../../Utils/Endpoints';
import { industryOptions } from '../../Utils/CompanyConstant';

const CssTextField = styled(TextField)(textFieldStyle);

function EditCompanyAttributeModal(props: { open: boolean, close: any, type: companyFieldType, value: any, companyId: string, update: any }) {

    const globalUsers = useSelector((state: any) => state.users);

    let init = false;
    useEffect(() => {
        if (init === true) { return; }
        init = true;
        setLocalVal(props.value)
    }, []);

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = useState(false);
    const [localVal, setLocalVal] = useState(props.value);
    const [contractAmount, setContractAmount] = useState(0);

    function handleClose() {
        props.close();
    }

    function handleValueUpdate(event: any) {
        setLocalVal(event.target.value);
    }

    function save() {
        let payload: any = {
            id: props.companyId
        }
        payload[props.type] = localVal
        if (localVal == null || localVal?.length < 1) {
            snackbarRef?.current?.show('Please fill all fields', 'warning');
            return;
        }
        if (props.type === 'nextRenewalDate') {
            if (contractAmount == null || contractAmount <= 0) {
                snackbarRef?.current?.show('Please fill all fields', 'warning')
                return;
            }
            payload['totalContractAmount'] = contractAmount;
        }

        try {
            setLoading(true);
            axios.post(updateCompanyURL(), payload, { withCredentials: true })
            setLoading(false);
            props.update(payload);
            snackbarRef?.current?.show('Saved', 'Success');
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
        }
    }

    function getFieldDisplay() {
        if (props.type === 'owner') {
            return <>
                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >Owner</Typography>
                <Select onChange={handleValueUpdate} fullWidth value={localVal} size='small' >
                    {
                        globalUsers?.map((user: any) => <MenuItem value={user.id} >{user.name}</MenuItem>)
                    }
                </Select>
            </>
        } else if (props.type === 'status' || props.type === 'contractStatus') {
            return <>
                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >
                    {props.type === 'contractStatus' ? 'Contract Status' : 'Status'}
                </Typography>
                <Select onChange={handleValueUpdate} value={localVal} fullWidth size='small' >
                    {getMetricOptions(props.type).map(val => <MenuItem value={val.value} >{val.label}</MenuItem>)}
                </Select>
            </>
        } else if (props.type === 'nextRenewalDate') {
            return <>
                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >Next Renewal Date</Typography>
                <CssTextField onChange={handleValueUpdate} fullWidth size='small' type='date' />

                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >Contract Amount</Typography>
                <Box display={'flex'} >
                    <Typography fontWeight={600} margin={'5px'} >$</Typography>
                    <CssTextField onChange={(e) => setContractAmount(parseInt(e.target.value))} fullWidth size='small' type='number' />
                </Box>
            </>
        } else if (props.type === 'industry') {
            return <>
                <Select onChange={handleValueUpdate} value={localVal} fullWidth size='small' >
                    {industryOptions.map(val => <MenuItem value={val.value} >{val.label}</MenuItem>)}
                </Select>
            </>
        } else if (props.type === 'lastContactDate') {
            return <>
                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >Last Contact Date</Typography>
                <CssTextField onChange={handleValueUpdate} fullWidth size='small' value={localVal} type='date' />
            </>
        } else {
            return <>
                <Typography sx={{ marginTop: '20px', fontSize: '13px', color: colorPalette.fsGray }} >{props.type}</Typography>
                <CssTextField fullWidth value={localVal} onChange={handleValueUpdate} size='small' />
            </>
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

export default EditCompanyAttributeModal