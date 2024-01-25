import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, IconButton, Modal, styled, TextField, Typography } from '@mui/material';
import { getColorsFromTheme, getCompConfigFromUiId, modalTabList, modalTabList2 } from '../Utils/FeedbackUtils';
import DynamicComponentDisplay from '../SurveyEngine/DynamicComponentDisplay';
import CustomTabSet from '../Components/CustomTabSet';
import CreateLogic from '../Components/Logic/CreateLogic';
import { logicType, userRoleType } from '../Utils/types';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { useSelector } from 'react-redux';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { colorPalette, componentName } from '../Utils/Constants';
import { textFieldStyle } from '../Styles/InputStyles';


const CssTextField = styled(TextField)(textFieldStyle);

function TextAnswerModal(props: any) {

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);
    //previously here the dependency array was  props.uid

    const createLogicRef = useRef<any>(null); // Create a ref for the child component
    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const [question, setQuestion] = useState('');
    const [background, setBackground] = useState<any>();
    const [value, setValue] = React.useState(0);
    const [logicData, setLogicData] = useState<logicType[]>([]);
    const [required, setRequired] = useState(false);
    const defaultColor = useSelector((state: any) => state.colorReducer);

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        setLogicData(compConfig?.logic || []);
        setQuestion(compConfig?.question || '');
        setRequired(compConfig?.required || false);
        if (props.theme != null) {
            const currentTheme = JSON.parse(props.theme);
            setBackground(currentTheme.background);
        }
    }

    const handleSave = () => {
        const logicData = createLogicRef?.current?.fetchData(); // Call fetchData() in child
        let obj = {
            question: question,
            logic: logicData,
            required: required
        }
        if (verifyComponent() === false) {
            return;
        }
        props.save(JSON.stringify(obj));
    }

    const verifyComponent = (): Boolean => {
        return true;
    }

    const handleTabChange = (newValue: number) => {
        setValue(newValue);
    };

    const handleRequiredCheckbox = (event: any) => {
        setRequired(event.target.checked);
    }

    const ModalSettings = () => {
        return (
            <>
                {
                    value === 2 &&
                    <Box padding={'10px'} margin={'10px'} >
                        <FormGroup>
                            <FormControlLabel
                                onClick={handleRequiredCheckbox}
                                control={<Checkbox checked={required} />}
                                label="Answer required."
                            />
                        </FormGroup>
                    </Box>
                }
            </>
        )
    }


    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyles.modalStyleComponents(defaultColor?.secondaryColor)}>
                    <Box width={'40%'} marginRight={10} >
                        <Box sx={ModalStyles.modalHeaderStyle} >
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                {props.header}
                            </Typography>
                            <IconButton sx={{ color: colorPalette.darkBackground }} >
                                <CloseIcon onClick={props.close} />
                            </IconButton>
                        </Box>
                        <ModalSnippets text={'To make changes, please unpublish the workflow'} published={props.isPublished} />
                        <ModalSnippets 
                            text={'Guest cannot edit the surveys'} 
                            published={!CoreUtils.isComponentVisible(userRole,componentName.SAVE_SURVEY_BUTTON)} 
                        />
                        <CustomTabSet
                            tabsetList={modalTabList}
                            change={(value: number) => handleTabChange(value)}
                            index={value}
                        >
                        </CustomTabSet>
                        {
                            value === 0 &&
                            <Box sx={ModalStyles.modalBodyContainerStyle} >
                                <CssTextField
                                    sx={{ input: { color: 'white' }, maxHeight: 'calc(100vh - 250px)' }}
                                    id="outlined-basic"
                                    placeholder='Enter your question here'
                                    variant="outlined"
                                    size={'small'}
                                    value={question}
                                    multiline
                                    style={{ width: '100%' }}
                                    onChange={(e) => setQuestion(e.target.value)}
                                />
                            </Box>
                        }
                        <CreateLogic
                            open={value === 1}
                            type={props.compId}
                            values={[]}
                            data={logicData}
                            ref={createLogicRef}
                        />
                        {ModalSettings()}
                        <Box sx={ModalStyles.modalButtonContainerStyle} >
                            <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                            <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
                        </Box>
                    </Box>
                    <Box className={background?.value} sx={{ backgroundColor: background?.value, width: '55%', overflowY: 'scroll' }} >
                        <DynamicComponentDisplay
                            data={{ question: question }}
                            compId={props.compId}
                            theme={props.theme}
                        />
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default TextAnswerModal