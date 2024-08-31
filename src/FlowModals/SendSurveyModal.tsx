import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCompConfigFromUiId, getEmailRecipientDesc, handleUnAuth } from '../Utils/FeedbackUtils';
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
import { setLoader } from '../Redux/Reducers/LoadingReducer';
import InfoIcon from '@mui/icons-material/Info';
import { getSurveyList } from '../Utils/Endpoints';
import axios from 'axios';
import VariablesModal from './VariablesModal';
import DynamicComponentIcon from '../FlowComponents/DynamicComponentIcon';

const CssTextField = styled(TextField)(textFieldStyle);

function SendSurveyModal(props: any) {

    const userRole: userRoleType = useSelector((state: any) => state.userRole);

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const dispatch = useDispatch();
    const [desc, setDesc] = useState('');
    const [surveyList, setSurveyList] = useState<any[]>([]);
    const [survey, setSurvey] = useState('');
    const [subject, setSubject] = useState('');
    const [showVar, setShowVar] = useState(false);

    let init = false;
    useEffect(() => {
        if (init === false) {
            getSurveys();
        }
        init = true;
    }, []);

    const getSurveys = async (): Promise<void> => {
        try {
            dispatch(setLoader(true));
            let { data } = await axios.get(getSurveyList(), { withCredentials: true });
            dispatch(setLoader(false));
            let resData: any = data.data;
            if (resData != null) {
                setSurveyList(resData);
            }
        } catch (error: any) {
            dispatch(setLoader(true));
            handleUnAuth(error);
        }
    }

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        if (compConfig?.desc) {
            setDesc(compConfig?.desc);
        } else {
            setDesc('');
        }

        if (compConfig?.survey) {
            setSurvey(compConfig?.survey);
        } else {
            setSurvey('');
        }

        if (compConfig?.subject) {
            setSubject(compConfig?.subject);
        } else {
            setSubject('');
        }
    }

    const handleSave = () => {
        let obj = {
            desc: desc,
            survey: survey,
            subject: subject
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
                                <CssTextField
                                    size='small'
                                    fullWidth
                                    label='Description'
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    sx={{ marginBottom: '20px' }}
                                />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }} >
                                    <Typography sx={{ fontSize: '12px', color: colorPalette.fsGray }} >
                                        <InfoIcon sx={{ position: 'relative', top: '3px', fontSize: '15px', marginRight: '5px' }} />
                                        {getEmailRecipientDesc(props.recordType)}
                                    </Typography>
                                    <Button
                                        onClick={() => setShowVar(true)}
                                        size='small'
                                        sx={{ ...outlinedButton, width: 'fit-content', marginTop: '0px' }}
                                    >
                                        Add Field
                                    </Button>
                                </Box>

                                <Select
                                    sx={{marginTop : '10px'}}
                                    value={survey}
                                    onChange={(e) => setSurvey(e.target.value)}
                                    displayEmpty
                                    size='small'
                                    fullWidth
                                >
                                    <MenuItem value={''} disabled >Select Survey</MenuItem>
                                    {
                                        surveyList?.map(s => <MenuItem value={s?.id} >{s?.name}</MenuItem>)
                                    }
                                </Select>
                                <CssTextField
                                    size='small'
                                    fullWidth
                                    label='Subject'
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    sx={{ marginTop: '20px' }}
                                />
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

export default SendSurveyModal