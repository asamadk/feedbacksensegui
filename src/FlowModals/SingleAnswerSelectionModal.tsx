import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Modal, styled, TextField, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import * as ModalStyles from '../Styles/ModalStyle'
import React, { useEffect, useRef, useState } from 'react'
import { getCompConfigFromUiId, modalTabList } from '../Utils/FeedbackUtils';
import DynamicComponentDisplay from '../SurveyEngine/DynamicComponentDisplay';
import Notification from '../Utils/Notification';
import CustomTabSet from '../Components/CustomTabSet';
import CreateLogic from '../Components/Logic/CreateLogic';
import { logicType, userRoleType } from '../Utils/types';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { useSelector } from 'react-redux';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { componentName } from '../Utils/Constants';

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#006DFF',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#006DFF',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#454545',
        },
        '&:hover fieldset': {
            borderColor: '#006DFF',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#006DFF',
        },
    },
    color: 'white'
});

function SingleAnswerSelectionModal(props: any) {

    const snackbarRef: any = useRef(null);
    const createLogicRef = useRef<any>(null); // Create a ref for the child component
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const userRole: userRoleType = useSelector((state: any) => state.userRole);

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const [value, setValue] = React.useState(0);
    const [background, setBackground] = useState<any>();
    const [answerChoiceList, setAnswerChoiceList] = useState<string[]>(['']);
    const [questionText, setQuestionText] = useState('');
    const [logicData, setLogicData] = useState<logicType[]>([]);

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        setQuestionText(compConfig?.question || '');
        setLogicData(compConfig?.logic || []);
        if (compConfig?.answerList != null) {
            setAnswerChoiceList([...compConfig?.answerList]);
        } else {
            setAnswerChoiceList(['']);
        }
        if (props.theme != null) {
            const currentTheme = JSON.parse(props.theme);
            setBackground(currentTheme.background);
        }
    }

    const handleSave = () => {
        const logicData = createLogicRef?.current?.fetchData(); // Call fetchData() in child
        let obj = {
            question: questionText,
            answerList: answerChoiceList,
            type: props.type,
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

    const handleAddAnswerChoice = () => {
        setAnswerChoiceList([...answerChoiceList, '']);
    }

    const handleTextFieldRemove = (index: number) => {
        let newArr: string[] = [];
        for (let i = 0; i < answerChoiceList.length; i++) {
            if (i === index) { continue; }
            newArr.push(answerChoiceList[i]);
        }

        if (newArr.length < 1) {
            newArr.push('');
        }

        setAnswerChoiceList(newArr);
    }

    const handleAnswerChange = (event: any, index: number) => {
        let tempAnswerChoice = answerChoiceList;
        tempAnswerChoice[index] = event.target.value;
        let newArr = JSON.parse(JSON.stringify(tempAnswerChoice));
        setAnswerChoiceList(newArr);
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
                <Box sx={ModalStyles.modalStyleComponents(defaultColor?.secondaryColor)}>
                    <Box width={'40%'} marginRight={10} >
                        <Box sx={ModalStyles.modalHeaderStyle} >
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                {props.header}
                            </Typography>
                            <IconButton sx={{ color: '#f1f1f1' }} >
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
                        ></CustomTabSet>
                        {
                            value === 0 &&
                            <Box sx={ModalStyles.modalBodyContainerStyle} >
                                <Typography sx={{ color: '#f1f1f1' }} >Question</Typography>
                                <CssTextField
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    sx={{ input: { color: 'white' }, marginTop: '10px' }}
                                    id="outlined-basic"
                                    placeholder='Enter your question here'
                                    variant="outlined"
                                    size={'small'}
                                    style={{ width: '100%' }}
                                    multiline
                                />

                                <Box marginTop={'20px'} >
                                    <Typography sx={{ color: '#f1f1f1' }} >Answer choices</Typography>
                                    {
                                        answerChoiceList?.map((answer, index) => {
                                            return (
                                                <Box key={index} display={'flex'} >
                                                    <CssTextField
                                                        onChange={(e) => handleAnswerChange(e, index)}
                                                        value={answer}
                                                        sx={{ input: { color: 'white' }, marginTop: '10px' }}
                                                        id="outlined-basic"
                                                        placeholder='Enter your answer here'
                                                        variant="outlined"
                                                        size={'small'}
                                                        style={{ width: '100%' }}
                                                    />
                                                    <IconButton onClick={() => handleTextFieldRemove(index)} >
                                                        <RemoveCircleIcon sx={{ color: '#f1f1f1' }} />
                                                    </IconButton>
                                                </Box>
                                            )
                                        })
                                    }
                                    <Typography
                                        sx={{ color: '#006dff', fontSize: '13px', cursor: 'pointer', marginTop: '20px' }}
                                        onClick={handleAddAnswerChoice}
                                    >
                                        Add an answer choice +
                                    </Typography>
                                </Box>
                            </Box>
                        }
                        <CreateLogic
                            open={value === 1}
                            type={props.compId}
                            values={answerChoiceList}
                            data={logicData}
                            ref={createLogicRef}
                        />
                        <Box sx={ModalStyles.modalButtonContainerStyle} >
                            <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                            <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
                        </Box>
                    </Box>
                    {/* <Box sx={{ backgroundColor: colors?.primaryColor, width: '55%' }} > */}
                    <Box className={background?.value} sx={{ backgroundColor: '#ffffff', width: '55%' }} >
                        <DynamicComponentDisplay
                            data={{
                                question: questionText,
                                answerList: answerChoiceList,
                                type: props.type
                            }}
                            theme={props.theme}
                            compId={props.compId}
                        />
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default SingleAnswerSelectionModal