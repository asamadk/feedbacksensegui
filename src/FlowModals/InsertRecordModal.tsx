import { Box, Button, Checkbox, FormControlLabel, IconButton, Modal, Radio, RadioGroup, TextField, Typography, styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { textFieldStyle } from '../Styles/InputStyles';
import { useSelector } from 'react-redux';
import { logicType, userRoleType } from '../Utils/types';
import { getCompConfigFromUiId, modalTabList } from '../Utils/FeedbackUtils';
import CloseIcon from '@mui/icons-material/Close';
import { automationModalHeaderStyle, flowModalStyleComponents, modalBodyContainerStyle, modalButtonContainerStyle, modalContainerStyle, modalHeaderStyle, modalStyleComponents } from '../Styles/ModalStyle';
import { colorPalette, componentName } from '../Utils/Constants';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { containedButton, outlinedButton } from '../Styles/ButtonStyle';
import ConditionBuilder, { ConditionBuilderRef } from '../Components/ConditionBuilder';
import { useDispatch } from 'react-redux';
import { showNotification } from '../Redux/Reducers/NotificationReducer';

const CssTextField = styled(TextField)(textFieldStyle);

function InsertRecordModal(props: any) {

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const dispatch = useDispatch();
    const conditionBuilderRef = useRef<ConditionBuilderRef>(null);
    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const [insertType, setInsertType] = useState<'all' | 'some'>('all');
    const [conditionBlock, setConditionBlock] = useState<any>([[]]);
    const [desc, setDesc] = useState('');

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);

        if (compConfig?.desc) {
            setDesc(compConfig?.desc);
        } else {
            setDesc('');
        }

        if (compConfig?.insertType) {
            setInsertType(compConfig?.insertType);
        } else {
            setInsertType('all');
        }

        if (compConfig?.insertType === 'some') {
            if (compConfig.conditionBlock) {
                setConditionBlock(compConfig.conditionBlock);
            } else {
                setConditionBlock([[]]);
            }
        } else {
            setConditionBlock([[]]);
        }
    }

    const handleSave = () => {
        let tmp;
        if (insertType === 'some' && conditionBuilderRef.current) {
            tmp = conditionBuilderRef.current.getState();
            setConditionBlock(tmp);
        }

        if (verifyComponent(tmp) === false) {
            return;
        }

        let obj = {
            conditionBlock: tmp,
            insertType: insertType,
            desc: desc
        }

        props.save(JSON.stringify(obj));
    }

    const verifyComponent = (tmp: any): boolean => {
        if (tmp == null && insertType === 'some') {
            dispatch(showNotification('Condition Incorrect', 'error'));
            return false;
        }
        return true;
    }

    function changeInsertType(event: any) {
        const val = event.target.value;
        setInsertType(val);
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
                            <Typography margin={'5px'} fontSize={'18px'} id="modal-modal-title" component="h2">
                                {`${props.header} ${props.recordType}`}
                            </Typography>
                            <IconButton sx={{ color: colorPalette.background }} >
                                <CloseIcon onClick={props.close} />
                            </IconButton>
                        </Box>

                        <Box height={'calc(100vh - 330px)'} sx={{ overflowY: 'scroll' }}>
                            <Box padding={'10px'} >
                                <ModalSnippets text={'To make changes, please un-publish the workflow'} published={props.isPublished} />
                                <ModalSnippets
                                    text={'Guest cannot edit the surveys'}
                                    published={!CoreUtils.isComponentVisible(userRole, componentName.SAVE_SURVEY_BUTTON)}
                                />
                            </Box>
                            <Box sx={{ ...modalBodyContainerStyle, marginTop: '0px' }} >
                                <Box padding={'15px'} color={'black'} fontSize={'12px'}>
                                    <CssTextField
                                        label='Description'
                                        size='small'
                                        fullWidth
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                    />
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={insertType}
                                        onChange={changeInsertType}
                                        name="radio-buttons-group"
                                        sx={{ marginTop: '20px' }}
                                    >
                                        <FormControlLabel
                                            value="all"
                                            name='n-1'
                                            control={<Radio color='secondary' size='small' />}
                                            label={`All ${props.header === 'Insert' ? 'inserted' : 'updated'} records`}
                                        />
                                        <FormControlLabel
                                            value="some"
                                            name='n-1'
                                            control={<Radio color='secondary' size='small' />}
                                            label="Add Conditions"
                                        />
                                    </RadioGroup>
                                </Box>

                                {
                                    insertType === 'some' &&
                                    <Box>
                                        <ConditionBuilder data={conditionBlock} ref={conditionBuilderRef} recordType={props.recordType} />
                                    </Box>
                                }
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

export default InsertRecordModal