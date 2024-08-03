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
import { textFieldStyle } from '../Styles/InputStyles';
import { showNotification } from '../Redux/Reducers/NotificationReducer';
import DynamicComponentIcon from '../FlowComponents/DynamicComponentIcon';

const CssTextField = styled(TextField)(textFieldStyle);

function WaitForModal(props: any) {

    function daysCount() {
        const tmp: number[] = [];
        for (let i = 1; i <= 30; i++) {
            tmp.push(i);
        }
        return tmp;
    }

    const userRole: userRoleType = useSelector((state: any) => state.userRole);

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const dispatch = useDispatch();
    const [desc, setDesc] = useState('');
    const [days, setDays] = useState(0);

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        if(compConfig?.desc){
            setDesc(compConfig?.desc);
        }else{
            setDesc('');
        }
        if(compConfig?.days){
            setDays(compConfig?.days);
        }else{
            setDays(0);
        }
    }

    const handleSave = () => {
        let obj = {
            desc : desc,
            days : days
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
                                    <DynamicComponentIcon id={props.compId}  />
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
                                <CssTextField
                                    size='small'
                                    fullWidth
                                    label='Description'
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    sx={{ marginBottom: '20px' }}
                                />
                                <Box display={'flex'}>
                                    <Typography color={'black'} marginTop={'5px'} marginRight={'10px'} >Wait for</Typography>
                                    <Select value={days} onChange={(e) => setDays(parseInt(e.target.value as string))} sx={{ width: '65px' }} size='small' >
                                        {
                                            daysCount().map(day => <MenuItem value={day} >{day}</MenuItem>)
                                        }
                                    </Select>
                                    <Typography color={'black'} marginTop={'5px'} marginLeft={'10px'} >days before moving forward.</Typography>
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
        </>
    )
}

export default WaitForModal