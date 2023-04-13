import { Box, Button, IconButton, Modal, styled, TextField, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import * as ModalStyles from '../Styles/ModalStyle'
import React, { useEffect, useRef, useState } from 'react'
import { getColorsFromTheme, getCompConfig } from '../Utils/FeedbackUtils';
import DynamicComponentDisplay from '../SurveyEngine/DynamicComponentDisplay';
import Notification from '../Utils/Notification';

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#FFA500',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#FFA500',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#454545',
        },
        '&:hover fieldset': {
            borderColor: '#FFA500',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FFA500',
        },
    },
    color: 'white'
});

function SingleAnswerSelectionModal(props: any) {

    const snackbarRef: any = useRef(null);

    useEffect(() => {
        populateCompConfig();
    }, []);

    const [colors , setColors] = useState<any>();
    const [answerChoiceList, setAnswerChoiceList] = useState<string[]>(['']);
    const [questionText, setQuestionText] = useState('');

    const populateCompConfig = () => {
        const compConfig = getCompConfig(props);
        setQuestionText(compConfig?.question);
        if (compConfig?.answerList != null) {
            setAnswerChoiceList([...compConfig?.answerList]);
        }
        if(props.theme != null){
            const currentTheme = JSON.parse(props.theme);
            setColors(getColorsFromTheme(currentTheme.theme));
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
        if (answerChoiceList.length > 10) {
            snackbarRef?.current?.show('Cannot use more than 10 answer chioces', 'error');
            return;
        }
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
                <Box sx={ModalStyles.modalStyleComponents}>
                    <Box width={'40%'} marginRight={10} >
                        <Box sx={ModalStyles.modalHeaderStyle} >
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                                {props.header}
                            </Typography>
                            <IconButton color='warning' sx={{ color: '#f1f1f1' }} >
                                <CloseIcon onClick={props.close} />
                            </IconButton>
                        </Box>

                        <Box sx={ModalStyles.modalBodyContainerStyle} >

                            <CssTextField
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                sx={{ input: { color: 'white' } }}
                                id="outlined-basic"
                                placeholder='Enter your question here'
                                variant="outlined"
                                size={'small'}
                                style={{ width: '100%' }}
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
                                    sx={{ color: '#454545', fontSize: '13px', textDecoration: 'underline', cursor: 'pointer', marginTop: '20px' }}
                                    onClick={handleAddAnswerChoice}
                                >
                                    Add an answer choice
                                </Typography>

                            </Box>

                        </Box>

                        <Box sx={ModalStyles.modalButtonContainerStyle} >
                            <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                            <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} variant="contained" onClick={handleSave} >Save</Button>
                        </Box>
                    </Box>
                    <Box sx={{ backgroundColor: colors?.primaryColor, width: '55%' }} >
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