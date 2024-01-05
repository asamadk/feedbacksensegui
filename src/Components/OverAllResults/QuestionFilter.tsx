import { Box, Button, MenuItem, Select } from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { muiSelectStyle } from '../../Styles/InputStyles'
import { outlinedButton } from '../../Styles/ButtonStyle'
import Notification from '../../Utils/Notification';
import FSLoader from '../FSLoader';
import { USER_UNAUTH_TEXT } from '../../Utils/Constants';
import { handleLogout } from '../../Utils/FeedbackUtils';
import { getSurveyFilterDataAPI } from '../../Utils/Endpoints';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FilterReducerType, setSurveyFilterData } from '../../Redux/Reducers/surveyFilterReducer';

function QuestionFilter({ handleAddFilter, surveyId }: any) {

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = React.useState(false);
    const [question, setQuestion] = useState<string | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [value, setValue] = useState<string | null>(null);
    const [questions,setQuestions] = useState<any[]>([]);
    
    const dispatch = useDispatch();

    const surveyFilterData : FilterReducerType = useSelector((state: any) => state.surveyFilterData);

    let init = false;
    useEffect(() => {
        if (init === false) {
            getSurveyFilterData();
            init = true;
        }
    }, [surveyId]);

    const getSurveyFilterData = () => {
        if(surveyFilterData?.surveyId === surveyId){
            setQuestions(surveyFilterData.data);
        }else{
            fetchFilterData();  
        }
    }

    const fetchFilterData = async () => {
        try {
            setLoading(true);
            const URL = getSurveyFilterDataAPI(surveyId);
            const { data } = await axios.get(URL, { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            if(data.data){
                setQuestions(data.data);
                dispatch(setSurveyFilterData({
                    surveyId : surveyId,
                    data : data.data
                }));
            }
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleQuestionSelect = (event: any) => {
        const selectedQuestionId = event.target.value;
        setQuestion(selectedQuestionId);
    };

    const handleOperatorSelect = (event: any) => {
        setOperator(event.target.value);
    };

    const handleAnswerSelect = (event: any) => {
        setValue(event.target.value);
    };

    const handleApplyClick = (question : string | null, operator : string | null, value : string | null) => {
        if(question == null || question.length < 1){
            snackbarRef?.current?.show('Please select a question.', 'error');
            return;
        }
        if(operator == null || operator.length < 1){
            snackbarRef?.current?.show('Please select an operator.', 'error');
            return;
        }
        if(value == null || value.length < 1){
            snackbarRef?.current?.show('Please select a value.', 'error');
            return;
        }
        handleAddFilter(
            question, 
            getQuestionTextById(question),
            operator, 
            value
        );
        setQuestion(null);
        setOperator(null);
        setValue(null);
    }

    const getQuestionTextById = (questionId : string) :string | null => {
        const ques = questions.find((q) => q.questionId === questionId);
        return ques ? ques.questionText : null;
    }

    return (
        <Box >
            <Box>
                <label style={labelStyleCSS} >Select question</label>
                <Select
                    value={question}
                    size='small'
                    sx={muiSelectStyle}
                    onChange={handleQuestionSelect}
                    fullWidth
                >
                    {questions.map((question) => (
                        <MenuItem key={question.questionId} value={question.questionId}>
                            {question.questionText}
                        </MenuItem>
                    ))}
                </Select>

                {
                    question &&
                    <>
                        <label style={{...labelStyleCSS,marginTop : '10px'}} >Select operator</label>
                        <Select
                            value={operator}
                            onChange={handleOperatorSelect}
                            sx={muiSelectStyle}
                            fullWidth
                            size='small'
                        >
                            {questions.find((q) => q.questionId === question)?.operators.map((operator : any) => (
                                <MenuItem key={operator} value={operator}>
                                    {operator}
                                </MenuItem>
                            ))}
                        </Select>
                    </>
                }

                { question && operator && (
                    <>
                        <label style={{...labelStyleCSS,marginTop: '10px' }} >Select answer</label>
                        <Select
                            value={value}
                            onChange={handleAnswerSelect}
                            size="small"
                            sx={muiSelectStyle}
                            fullWidth
                        >
                            {questions.find((q) => q.questionId === question)?.answers.map((answer : any) => (
                                <MenuItem key={answer} value={answer}>
                                    {answer}
                                </MenuItem>
                            ))}
                        </Select>
                    </>
                )}

            </Box>
            <Box display={'flex'} justifyContent={'center'} >
                <Button
                    sx={{ ...outlinedButton, width: 'fit-content' }}
                    size='small'
                    onClick={() => { handleApplyClick(question, operator, value) }}
                >Add Filter</Button>
            </Box>
            <Notification ref={snackbarRef} />
            <FSLoader show={loading} />
        </Box>
    )
}

const labelStyleCSS = {
    fontSize : '12px',
    color : '#808080'
}

export default QuestionFilter