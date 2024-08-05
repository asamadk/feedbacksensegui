import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCompConfigFromUiId } from '../Utils/FeedbackUtils';
import { Box, Button, IconButton, MenuItem, Modal, Select, TextField, Typography, styled } from '@mui/material';
import { flowModalStyleComponents, modalButtonContainerStyle, modalHeaderStyle, modalBodyContainerStyle, automationModalHeaderStyle } from '../Styles/ModalStyle';
import { colorPalette, componentName } from '../Utils/Constants';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { userRoleType } from '../Utils/types';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { muiSelectStyle, textFieldStyle } from '../Styles/InputStyles';
import { taskPriorityOptions } from '../Utils/CompanyConstant';
import DynamicComponentIcon from '../FlowComponents/DynamicComponentIcon';
import VariablesModal from './VariablesModal';
import InfoIcon from '@mui/icons-material/Info';

const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

function NewTaskModal(props: any) {

    function dueDuration() {
        const tmp: string[] = [];
        for (let i = 1; i <= 30; i++) {
            tmp.push(`${i} ${i === 1 ? 'Day' : 'Days'}`)
        }
        return tmp;
    }

    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const userState = useSelector((state: any) => state.users);

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const [showVar, setShowVar] = useState(false);
    const [desc, setDesc] = useState('');
    const [owner, setOwner] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [title, setTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        if (compConfig?.desc) {
            setDesc(compConfig?.desc);
        } else {
            setDesc('');
        }

        if (compConfig?.title) {
            setTitle(compConfig?.title)
        } else {
            setTitle('')
        }

        if (compConfig?.taskDesc) {
            setTaskDesc(compConfig?.taskDesc)
        } else {
            setTaskDesc('')
        }

        if (compConfig?.owner) {
            setOwner(compConfig?.owner)
        } else {
            setOwner('')
        }

        if (compConfig?.priority) {
            setPriority(compConfig?.priority)
        } else {
            setPriority('')
        }

        if (compConfig?.dueDate) {
            setDueDate(compConfig?.dueDate)
        } else {
            setDueDate('')
        }
    }

    const handleSave = () => {
        let obj = {
            desc: desc,
            title: title,
            taskDesc: taskDesc,
            owner: owner,
            priority: priority,
            dueDate: dueDate
        }
        props.save(JSON.stringify(obj));
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={flowModalStyleComponents(colorPalette.background)}>
                    <Box width={'100%'}>
                        <Box sx={automationModalHeaderStyle} >
                            <Box display={'flex'} >
                                <Box marginTop={'7px'} marginLeft={'10px'} >
                                    <DynamicComponentIcon id={props.compId} />
                                </Box>
                                <Typography fontWeight={600} margin={'5px'} fontSize={'18px'} id="modal-modal-title" component="h2">
                                    {props.header}
                                </Typography>
                            </Box>
                            <IconButton sx={{ color: 'black' }} >
                                <CloseIcon onClick={props.close} />
                            </IconButton>
                        </Box>

                        <Box height={'calc(100vh - 100px)'} sx={{ overflowY: 'scroll' }}>
                            <Box padding={'10px'} >
                                <ModalSnippets text={'To make changes, please un-publish the workflow'} published={props.isPublished} />
                                <ModalSnippets
                                    text={'Guest cannot edit the surveys'}
                                    published={!CoreUtils.isComponentVisible(userRole, componentName.SAVE_SURVEY_BUTTON)}
                                />
                            </Box>
                            <Box sx={{ ...modalBodyContainerStyle, marginTop: '0px', padding: '20px' }} >
                                <Box sx={{ display: 'flex', justifyContent: 'start',marginBottom : '5px' }} >
                                    <Typography sx={{ fontSize: '12px', color: colorPalette.fsGray }} >
                                        <InfoIcon sx={{ position: 'relative', top: '3px', fontSize: '15px', marginRight: '5px' }} />
                                        Company & Person will be automatically added to the task
                                    </Typography>
                                </Box>
                                <CssTextField
                                    size='small'
                                    fullWidth
                                    label='Description'
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    sx={{ marginBottom: '20px' }}
                                />

                                <CssTextField
                                    size='small'
                                    fullWidth
                                    label='Title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    sx={{ marginBottom: '20px' }}
                                />
                                <CssTextField
                                    size='small'
                                    fullWidth
                                    label='Task Description'
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                    sx={{ marginBottom: '20px' }}
                                />

                                <Box width={'100%'} >
                                    <Typography sx={{ color: 'black', fontSize: '12px' }} >Assign To*</Typography>
                                    <CustomSelect
                                        size='small'
                                        placeholder='Owner'
                                        fullWidth
                                        value={owner}
                                        onChange={(e) => setOwner(e.target.value as string)}
                                    >
                                        {
                                            userState.map((owner: any) => (
                                                <MenuItem value={owner.id} >{owner.name}</MenuItem>
                                            ))
                                        }
                                    </CustomSelect>
                                </Box>

                                <Box sx={{ marginTop: '20px' }} width={'100%'} display={'flex'} justifyContent={'space-between'} >
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
                                    <Box width={'49%'} >
                                        <Typography sx={{ fontSize: '12px', color: 'black' }} >Due In*</Typography>
                                        <CustomSelect
                                            size='small'
                                            placeholder='Owner'
                                            fullWidth
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value as string)}
                                        >
                                            {
                                                dueDuration().map((day: any) => (
                                                    <MenuItem value={day} >{day}</MenuItem>
                                                ))
                                            }
                                        </CustomSelect>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={modalButtonContainerStyle} >
                            <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                            <Button style={{ width: 'fit-content' }} sx={containedButton} variant="contained" onClick={handleSave} >Save</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            {
                showVar &&
                <VariablesModal recordType={props.recordType} open={showVar} close={() => setShowVar(false)} />
            }
        </>
    )
}

export default NewTaskModal