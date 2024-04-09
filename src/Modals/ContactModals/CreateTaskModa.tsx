import { Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography, styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle } from '../../Styles/ModalStyle';
import { colorPalette } from '../../Utils/Constants';
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { LoadingButton } from '@mui/lab';
import Notification from '../../Utils/Notification';
import { muiSelectStyle, textFieldStyle } from '../../Styles/InputStyles';
import { taskPriorityOptions, taskStatusOptions } from '../../Utils/CompanyConstant';
import { useSelector } from 'react-redux';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { createTaskURL, updateTaskURL } from '../../Utils/Endpoints';

const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

function CreateTaskModal(props: any) {

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = useState(false);

    const companiesOptions = useSelector((state: any) => state.companies);
    const peopleOptions = useSelector((state: any) => state.people);

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [person, setPerson] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState('');

    let init = false;
    useEffect(() => {
        if (init === false) {
            if (props.data != null) {
                populateTaskData(props.data);
            }
            init = true;
        }
    }, [props.data]);

    function populateTaskData(task: any) {
        setTitle(task.title);
        setDesc(task.description);
        setPriority(task.priority);
        setDueDate(task.dueDate);
        setPerson(task[0]?.id);
        setCompany(task.company[0]?.id);
        setStatus(task.status);
    }

    const handleClose = () => {
        props.close({ refresh: false });
    }

    async function handleCreateTask() {
        const payload: any = {
            personID: person,
            companyID: props.companyId,
            title: title,
            description: desc,
            priority: priority,
            dueDate: dueDate,
            status: status,
        }

        if (props.data != null) {
            payload.id = props.data.id;
        }

        if (
            payload.title == null || payload.title.length < 1 ||
            payload.priority == null || payload.priority.length < 1 ||
            payload.dueDate == null || payload.dueDate.length < 1
        ) {
            snackbarRef?.current?.show('Please select all the required values', 'warning');
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                props.data == null ? createTaskURL() : updateTaskURL(),
                payload,
                { withCredentials: true }
            );
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
                <Box sx={modalStyle(colorPalette.background)}>
                    <Box sx={modalHeaderStyle} >
                        <Box>
                            <Typography id="modal-modal-title" variant="h5" component="h2" >
                                {props.data != null ? 'Update' : 'Create'} Task
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    <Box marginTop={'20px'} >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Title*</Typography>
                                <CssTextField
                                    size='small'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    sx={{ input: { color: colorPalette.darkBackground } }}
                                    fullWidth
                                />
                            </Box>
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Description</Typography>
                                <CssTextField
                                    size='small'
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    sx={{ input: { color: colorPalette.darkBackground } }}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box marginTop={'20px'} >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Priority*</Typography>
                                <CustomSelect
                                    size='small'
                                    placeholder='plan'
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as string)}
                                    fullWidth
                                >
                                    {
                                        taskPriorityOptions.map(priority => (
                                            <MenuItem value={priority} >{priority}</MenuItem>
                                        ))
                                    }
                                </CustomSelect>
                            </Box>
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Due date*</Typography>
                                <CssTextField
                                    type='date'
                                    size='small'
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    sx={{ input: { color: colorPalette.darkBackground } }}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </Box>
                    <Box marginTop={'20px'} >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Person</Typography>
                                <CustomSelect
                                    size='small'
                                    placeholder='plan'
                                    fullWidth
                                    value={person}
                                    onChange={(e) => setPerson(e.target.value as string)}
                                >
                                    {
                                        peopleOptions?.map((people: any) =>
                                            people.company.id === props.companyId &&
                                            <MenuItem value={people.id} >{people.firstName}</MenuItem>
                                        )
                                    }
                                </CustomSelect>
                            </Box>
                            <Box sx={{ width: '49%' }} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Company</Typography>
                                <CustomSelect
                                    disabled={true}
                                    size='small'
                                    placeholder='plan'
                                    value={props.companyId}
                                    fullWidth
                                >
                                    {
                                        companiesOptions?.map((company: any) =>
                                            company.id === props.companyId &&
                                            <MenuItem value={company.id} >{company.name}</MenuItem>
                                        )
                                    }
                                </CustomSelect>
                            </Box>
                        </Box>
                    </Box>
                    <Box marginTop={'20px'} >
                        <Box width={'100%'} >
                            <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Status</Typography>
                            <CustomSelect
                                size='small'
                                placeholder='plan'
                                fullWidth
                                value={status}
                                onChange={(e) => setStatus(e.target.value as string)}
                            >
                                {
                                    taskStatusOptions.map(status => (
                                        <MenuItem value={status} >{status}</MenuItem>
                                    ))
                                }
                            </CustomSelect>
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
                            onClick={handleCreateTask}
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

export default CreateTaskModal