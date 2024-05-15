import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { Box, Button, IconButton, Modal, styled, TextField, Typography } from '@mui/material';
import { getCompConfigFromUiId, modalTabList } from '../Utils/FeedbackUtils';
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

function CSATModal(props: any) {

    const createLogicRef = useRef<any>(null); // Create a ref for the child component

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const [value, setValue] = React.useState(0);
    const [background, setBackground] = useState<any>();
    const [question, setQuestion] = useState('');
    const [leftText, setLeftText] = useState('');
    const [rightText, setRightText] = useState('');
    const [logicData, setLogicData] = useState<logicType[]>([]);

    const userRole: userRoleType = useSelector((state: any) => state.userRole);

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        setQuestion(compConfig?.question || '');
        setLeftText(compConfig?.leftText || '');
        setRightText(compConfig?.rightText || '');
        setLogicData(compConfig?.logic || []);
        if (props.theme != null) {
            const currentTheme = JSON.parse(props.theme);
            setBackground(currentTheme.background);
        }
    }

    const handleSave = () => {
        const logicData = createLogicRef?.current?.fetchData(); // Call fetchData() in child
        let obj = {
            question: question,
            leftText: leftText,
            rightText: rightText,
            logic: logicData
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

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyles.modalStyleComponents(colorPalette.background)}>
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
                            published={!CoreUtils.isComponentVisible(userRole, componentName.SAVE_SURVEY_BUTTON)}
                        />
                        <CustomTabSet
                            tabsetList={modalTabList}
                            change={(value: number) => handleTabChange(value)}
                            index={value}
                        ></CustomTabSet>

                        {
                            value === 0 &&
                            <Box>

                                <Box sx={ModalStyles.modalBodyContainerStyle} >
                                    <CssTextField
                                        sx={{ maxHeight: '50vh' }}
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

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px' }} >
                                    <CssTextField
                                        id="outlined-basic"
                                        placeholder='Text on the very left'
                                        variant="outlined"
                                        size={'small'}
                                        value={leftText}
                                        onChange={(e) => setLeftText(e.target.value)}
                                    />
                                    <CssTextField
                                        id="outlined-basic"
                                        placeholder='Text on the very right'
                                        variant="outlined"
                                        size={'small'}
                                        value={rightText}
                                        onChange={(e) => setRightText(e.target.value)}
                                    />
                                </Box>
                            </Box>
                        }
                        <CreateLogic
                            open={value === 1}
                            type={props.compId}
                            values={Array.from({ length: 5 }, (_, i) => i + 1)}
                            data={logicData}
                            ref={createLogicRef}
                        />
                        <Box sx={ModalStyles.modalButtonContainerStyle} >
                            <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                            <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
                        </Box>
                    </Box>
                    <Box className={background?.value} sx={{ backgroundColor: background?.value, width: '55%' }} >
                        <DynamicComponentDisplay
                            data={{
                                question: question,
                                leftText: leftText,
                                rightText: rightText
                            }}
                            theme={props.theme}
                            compId={props.compId}
                        />
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default CSATModal