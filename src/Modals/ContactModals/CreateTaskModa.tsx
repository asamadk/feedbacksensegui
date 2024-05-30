import { Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography, styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { modalButtonContainerStyle, modalHeaderStyle, modalStyle, verticalModalStyle } from '../../Styles/ModalStyle';
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
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

function CreateTaskModal(props: any) {

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = useState(false);

    const companiesOptions = useSelector((state: any) => state.companies);
    const peopleOptions = useSelector((state: any) => state.people);
    const userState = useSelector((state: any) => state.users);

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [person, setPerson] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState('');
    const [owner,setOwner] = useState('');

    let init = false;
    useEffect(() => {
        if (init === false) {
            if (props.data != null) {
                populateTaskData(props.data);
            }else{
                setCompany(props.companyId);
                setPerson(props.personId)
            }
            init = true;
        }
    }, [props.data]);

    function populateTaskData(task: any) {
        setTitle(task.title);
        setDesc(task.description);
        setPriority(task.priority);
        setDueDate(task.dueDate);
        setPerson(task.person[0]?.id);
        setCompany(task.company[0]?.id);
        setStatus(task.status);
        setOwner(task?.owner?.id);
    }

    const handleClose = () => {
        props.close({ refresh: false });
    }

    async function handleCreateTask() {
        const payload: any = {
            personID: person,
            companyID: company,
            title: title,
            description: desc,
            priority: priority,
            dueDate: dueDate,
            status: status,
            owner : owner
        }

        if (props.data != null) {
            payload.id = props.data.id;
        }

        if (
            payload.title == null || payload.title.length < 1 ||
            payload.priority == null || payload.priority.length < 1 ||
            payload.dueDate == null || payload.dueDate.length < 1 ||
            payload.status == null || payload.status.length < 1 ||
            payload.owner == null || payload.owner.length < 1
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
                <Box sx={verticalModalStyle(colorPalette.background)}>
                    <Box sx={modalHeaderStyle} >
                        <Box>
                            <Typography id="modal-modal-title" variant="h5" component="h2" >
                                {props.data != null ? 'Update' : 'Add'} Task
                            </Typography>
                        </Box>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    <Box >
                        <Box marginTop={'20px'} >
                            <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Title*</Typography>
                            <CssTextField
                                size='small'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                sx={{ input: { color: colorPalette.darkBackground } }}
                                fullWidth
                            />
                            {/* <Editor editorState={desc} onChange={(state) => setDesc(state)} /> */}
                        </Box>
                        <Box marginTop={'20px'} >
                            <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Description</Typography>
                            <CssTextField
                                size='small'
                                value={desc}
                                multiline
                                onChange={(e) => setDesc(e.target.value)}
                                sx={{ input: { color: colorPalette.darkBackground } }}
                                fullWidth
                            />
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
                                    <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Company</Typography>
                                    <CustomSelect
                                        size='small'
                                        placeholder='company'
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value as string)}
                                        fullWidth
                                    >
                                        {
                                            companiesOptions?.map((company: any) =>
                                                <MenuItem value={company.id} >{company.name}</MenuItem>
                                            )
                                        }
                                    </CustomSelect>
                                </Box>
                                <Box sx={{ width: '49%' }} >
                                    <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Person</Typography>
                                    <CustomSelect
                                        size='small'
                                        placeholder='person'
                                        fullWidth
                                        disabled={company == null || company.length < 1}
                                        value={person}
                                        onChange={(e) => setPerson(e.target.value as string)}
                                    >
                                        {
                                            peopleOptions?.map((people: any) => {
                                                return(
                                                    people?.company?.id == company &&
                                                    <MenuItem value={people.id} >{people.firstName}</MenuItem>
                                                )
                                            })
                                        }
                                    </CustomSelect>
                                </Box>
                            </Box>
                        </Box>
                        <Box marginTop={'20px'} >
                            <Box width={'100%'} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Assign To*</Typography>
                                <CustomSelect
                                    size='small'
                                    placeholder='Owner'
                                    fullWidth
                                    value={owner}
                                    onChange={(e) => setOwner(e.target.value as string)}
                                >
                                    {
                                        userState.map((owner :any) => (
                                            <MenuItem value={owner.id} >{owner.name}</MenuItem>
                                        ))
                                    }
                                </CustomSelect>
                            </Box>
                        </Box>
                        <Box marginTop={'20px'} >
                            <Box width={'100%'} >
                                <Typography sx={{ color: colorPalette.fsGray, fontSize: '12px' }} >Status*</Typography>
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