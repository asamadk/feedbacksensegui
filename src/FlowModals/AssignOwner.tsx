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
import DynamicComponentIcon from '../FlowComponents/DynamicComponentIcon';

const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

function AssignOwnerModal(props: any) {

    const userRole: userRoleType = useSelector((state: any) => state.userRole);

    const dispatch = useDispatch();
    const [desc, setDesc] = useState('');
    const [owner, setOwner] = useState('');
    const userState = useSelector((state: any) => state.users);

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        if (compConfig?.desc) {
            setDesc(compConfig?.desc);
        } else {
            setDesc('');
        }

        if (compConfig?.owner) {
            setOwner(compConfig?.owner)
        } else {
            setOwner('')
        }
    }

    const handleSave = () => {
        if (verifyComponent() === false) {
            return;
        }
        let obj = {
            desc: desc,
            owner: owner
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
                                <Box marginTop={'10px'} width={'100%'} >
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

export default AssignOwnerModal