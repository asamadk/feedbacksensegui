import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { Box, Button, Divider, IconButton, Modal, Select, Slider, styled, TextField, Typography } from '@mui/material';
import { getColorsFromTheme, getCompConfigFromUiId, modalTabList } from '../Utils/FeedbackUtils';
import DynamicComponentDisplay from '../SurveyEngine/DynamicComponentDisplay';
import CustomTabSet from '../Components/CustomTabSet';
import ModalSnippets from '../SurveyEngine/CommonSnippets/ModalSnippets';
import { useSelector } from 'react-redux';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { componentName } from '../Utils/Constants';
import { userRoleType } from '../Utils/types';

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

function ContactFormModal(props: any) {

    useEffect(() => {
        populateCompConfig();
    }, [props.open]);

    const [background, setBackground] = useState<any>();
    const [answerChoiceList, setAnswerChoiceList] = useState<string[]>(['']);
    const [questionText, setQuestionText] = useState('');
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const userRole: userRoleType = useSelector((state: any) => state.userRole);

    const populateCompConfig = () => {
        const compConfig = getCompConfigFromUiId(props);
        setQuestionText(compConfig?.question || '');
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
        let obj = {
            question: questionText,
            answerList: answerChoiceList,
            type: props.type
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

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyles.modalStyleComponents(defaultColor?.secondaryColor)}>
                    <Box width={'40%'} marginRight={10} sx={{ overflowY: 'scroll' }}>
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
                        <Box>
                            <Box sx={ModalStyles.modalBodyContainerStyle} >
                                <Box>
                                    <CssTextField
                                        value={questionText}
                                        onChange={(e) => setQuestionText(e.target.value)}
                                        sx={{ input: { color: 'white' }, maxHeight: '50vh' }}
                                        id="outlined-basic"
                                        placeholder='Enter your question here'
                                        variant="outlined"
                                        size={'small'}
                                        multiline
                                        style={{ width: '100%' }}
                                    />
                                </Box>
                            </Box>
                            <Box marginTop={'20px'} >
                                <Typography sx={{ color: '#f1f1f1' }} >Answer choices</Typography>
                                {
                                    answerChoiceList.map((answer, index) => {
                                        return (
                                            <Box key={index} display={'flex'} >
                                                <CssTextField
                                                    onChange={(e) => handleAnswerChange(e, index)}
                                                    value={answer}
                                                    sx={{ input: { color: 'white' }, marginTop: '10px' }}
                                                    id="outlined-basic"
                                                    placeholder='Field label'
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
                        <Box sx={ModalStyles.modalButtonContainerStyle} marginBottom={'50px'}>
                            <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                            <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
                        </Box>
                    </Box>
                    <Box className={background?.value} sx={{ backgroundColor: '#ffffff', width: '55%' }} >
                        <DynamicComponentDisplay
                            theme={props.theme}
                            data={{
                                question: questionText,
                                answerList: answerChoiceList,
                                type: props.type
                            }}
                            compId={props.compId}
                        />
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default ContactFormModal