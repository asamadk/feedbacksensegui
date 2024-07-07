import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { getCompConfigFromUiId } from '../Utils/FeedbackUtils';
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import { flowModalStyleComponents, modalButtonContainerStyle, modalHeaderStyle, modalBodyContainerStyle, automationModalHeaderStyle } from '../Styles/ModalStyle';
import { colorPalette, componentName } from '../Utils/Constants';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { userRoleType } from '../Utils/types';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';

function SegmentModal(props: any) {

    const userRole: userRoleType = useSelector((state: any) => state.userRole);

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const dispatch = useDispatch();

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
    }

    const handleSave = () => {
        if (verifyComponent() === false) {
            return;
        }
        let obj = {
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
            >
                <Box sx={flowModalStyleComponents(colorPalette.background)}>
                    <Box width={'100%'}>
                        <Box sx={automationModalHeaderStyle} >
                            <Box></Box>
                            <Typography margin={'5px'} id="modal-modal-title" fontSize={'18px'} component="h2">
                                {props.header}
                            </Typography>
                            <IconButton  >
                                <CloseIcon sx={{color : 'white'}} onClick={props.close} />
                            </IconButton>
                        </Box>

                        <Box height={'calc(100vh - 330px)'} sx={{ overflowY: 'scroll' }}>
                            <ModalSnippets text={'To make changes, please un-publish the workflow'} published={props.isPublished} />
                            <ModalSnippets
                                text={'Guest cannot edit the surveys'}
                                published={!CoreUtils.isComponentVisible(userRole, componentName.SAVE_SURVEY_BUTTON)}
                            />
                            <Box sx={{ ...modalBodyContainerStyle, marginTop: '0px' }} >

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

export default SegmentModal