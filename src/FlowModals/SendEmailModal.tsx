import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCompConfigFromUiId, getEmailRecipientDesc } from '../Utils/FeedbackUtils';
import { Box, Button, IconButton, Modal, TextField, Typography, styled } from '@mui/material';
import { flowModalStyleComponents, modalButtonContainerStyle, modalHeaderStyle, modalBodyContainerStyle, automationModalHeaderStyle } from '../Styles/ModalStyle';
import { colorPalette, componentName } from '../Utils/Constants';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { userRoleType } from '../Utils/types';
import { useSelector } from 'react-redux';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import { textFieldStyle } from '../Styles/InputStyles';
import VariablesModal from './VariablesModal';
import DynamicComponentIcon from '../FlowComponents/DynamicComponentIcon';

const CssTextField = styled(TextField)(textFieldStyle);

function SendEmailModal(props: any) {

    const userRole: userRoleType = useSelector((state: any) => state.userRole);

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const [desc, setDesc] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [showVar, setShowVar] = useState(false);

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        if (compConfig?.desc) {
            setDesc(compConfig?.desc);
        } else {
            setDesc('');
        }

        if (compConfig?.subject) {
            setSubject(compConfig?.subject);
        } else {
            setSubject('');
        }

        if (compConfig?.body) {
            setBody(compConfig?.body);
        } else {
            setBody('');
        }
    }

    const handleSave = () => {
        if (verifyComponent() === false) {
            return;
        }
        let obj = {
            desc: desc,
            subject: subject,
            body: body
        }
        props.save(JSON.stringify(obj));
    }

    const verifyComponent = (): boolean => {
        return true;
    }


    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
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

                                <Box sx={{display : 'flex',justifyContent : 'space-between'}} >
                                    <Typography sx={{ fontSize: '12px', color: colorPalette.fsGray }} >
                                        <InfoIcon sx={{ position: 'relative', top: '3px', fontSize: '15px', marginRight: '5px' }} />
                                        {getEmailRecipientDesc(props.recordType)}
                                    </Typography>
                                    <Button 
                                        onClick={() => setShowVar(true)} 
                                        size='small' 
                                        sx={{ ...outlinedButton, width: 'fit-content',marginTop : '0px' }} 
                                    >
                                        Add Field
                                    </Button>
                                </Box>

                                <CssTextField
                                    size='small'
                                    fullWidth
                                    label='Subject'
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    sx={{ marginTop: '20px' }}
                                />

                                <CssTextField
                                    size='small'
                                    fullWidth
                                    multiline
                                    label='Body'
                                    value={body}
                                    rows={8}
                                    onChange={(e) => setBody(e.target.value)}
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

export default SendEmailModal