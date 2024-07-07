import { Autocomplete, Box, Button, IconButton, Modal, TextField, Typography, createFilterOptions, styled } from '@mui/material'
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import Notification from '../../Utils/Notification';
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../../Styles/ModalStyle';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import { colorPalette } from '../../Utils/Constants';
import SellIcon from '@mui/icons-material/Sell';
import CloseIcon from '@mui/icons-material/Close';
import { textFieldStyle } from '../../Styles/InputStyles';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { createTagURL, getTagURL } from '../../Utils/Endpoints';

const CssTextField = styled(TextField)(textFieldStyle);
const filter = createFilterOptions<string>();


function CreateTagModal(props: any) {

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = useState(false);
    const [tagList, setTagList] = useState<string[]>([]);
    const [value, setValue] = React.useState<string>('');
    const [status, setStatus] = useState<'insert' | 'update'>('update')

    let init = false;

    useEffect(() => {
        if(init === false){
            fetchTagList();
            init = true;
        }
    }, []);

    async function fetchTagList(){
        try {
            setLoading(true);
            const { data } = await axios.get(getTagURL(),{withCredentials : true});
            if(data.data){
                const tmp :string[] = [];
                data.data?.forEach((d : any) => {
                    tmp.push(d.name);
                });
                setTagList(tmp);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    const handleClose = () => {
        props.close({ refresh: false });
    }

    async function handleCreateTag() {
        const payload = {
            companyId: props.companyId,
            name: value,
            status: status
        }
        if (
            payload.companyId == null || payload.companyId.length < 1 ||
            payload.name == null || payload.name.length < 1 ||
            payload.status == null || payload.status.length < 1
        ) {
            snackbarRef?.current?.show('Please fill all the values', 'warning');
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.post(createTagURL(), payload, { withCredentials: true });
            const res = data.data;
            snackbarRef?.current?.show(data.message, data.data ? 'success' : 'error');
            setLoading(false);
            props.update(res);
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
        }
    }

    function handleAutoCompleteChange(event: SyntheticEvent<Element, Event>, newValue: string | null) {
        if (newValue != null && newValue.length > 0) {
            if (newValue.includes('"')) {
                setValue(newValue.substring(
                    newValue.indexOf('"') + 1, newValue.lastIndexOf('"')
                ));
                setStatus('insert');
            } else {
                setValue(newValue);
                setStatus('update');
            }
        } else {
            setValue('');
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
                                <SellIcon /> Add tag
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    <Box marginTop={'20px'} >
                        <Box sx={{ display: 'flex', justifyContent: 'center' }} >
                            <Autocomplete
                                value={value}
                                onChange={handleAutoCompleteChange}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);
                                    const { inputValue } = params;
                                    const isExisting = options.some((option) => inputValue === option);
                                    if (inputValue !== '' && !isExisting) {
                                        filtered.push(`Add "${inputValue}"`);
                                    }
                                    return filtered;
                                }}
                                selectOnFocus
                                size='small'
                                fullWidth
                                handleHomeEndKeys
                                id="free-solo-with-text-demo"
                                options={tagList}
                                getOptionLabel={(option) => {
                                    if (option) {
                                        return option;
                                    }
                                    return option;
                                }}
                                renderOption={(props, option) => <li {...props}>{option}</li>}
                                sx={{ width: 300 }}
                                freeSolo
                                renderInput={(params) => (
                                    <CssTextField {...params} label="Tags" />
                                )}
                            />
                        </Box>
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
                            onClick={handleCreateTag}
                        >
                            Create
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default CreateTagModal